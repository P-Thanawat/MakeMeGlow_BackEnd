const { Op } = require('sequelize');
const { Order, OrderItem, Product } = require('../models');
const moment = require('moment');

// get all data
exports.getOrderByTime = async (req, res, next) => {
  try {
    const { startTime, endTime, selectedTime } = req.query;
    console.log(`startTime`, startTime);
    console.log(`endTime`, endTime);
    const order = await Order.findAll({
      where: {
        status: 'successful',
        paidAt: {
          [Op.gte]: new Date(startTime),
          [Op.lt]: new Date(endTime),
        },
      },
    });

    order.map((item, index) => {
      order[index].paidAt = new Date(moment.utc(item.paidAt).add(7, 'hours').format())
    })

    //* find percent
    let percent = 0;
    let oldOrder = [];
    console.log(`selectedTime`, selectedTime);

    if (selectedTime === 'day') {
      const day = new Date(startTime).getDate();
      const startTime2 = new Date();
      startTime2.setDate(day - 1);
      startTime2.setHours(0, 0, 0, 0);
      const endTime2 = new Date();
      endTime2.setDate(day);
      endTime2.setHours(0, 0, 0, 0);

      oldOrder = await Order.findAll({
        where: {
          status: 'successful',
          paidAt: {
            [Op.gte]: startTime2,
            [Op.lt]: endTime2,
          },
        },
      });
    }

    if (selectedTime === 'week') {
      const weeksInYear = moment(startTime).week();
      oldOrder = await Order.findAll({
        where: {
          status: 'successful',
          paidAt: {
            [Op.gte]: moment.utc().week(weeksInYear).day(-7).hour(0).minute(0).second(0),
            [Op.lt]: moment.utc().week(weeksInYear).day(0).hour(0).minute(0).second(0),
          },
        },
      });
    }

    if (selectedTime === 'month') {
      const findWeeksInMonth = (time) => {
        const date = new Date(time);
        const thisMonth = date.getMonth() + 1;
        const thisYear = date.getFullYear();
        const firstDay = new Date(thisYear, thisMonth - 1, 1).getDay(); //which day
        const daysInMonth = new Date(thisYear, thisMonth, 0).getDate();
        const weeksInMonth = Math.ceil((daysInMonth + firstDay - 7) / 7) + 1;
        return weeksInMonth;
      };
      const startTime2 = moment(startTime).add(2, 'week').add(-1, 'month').format();
      const oldWeeksInMonth = findWeeksInMonth(startTime2);

      const weeksInYear = moment(startTime)
        .day(-7 * (oldWeeksInMonth - 1))
        .week();
      console.log(`start`, moment.utc().week(weeksInYear).day(0).hour(0).minute(0).second(0));
      console.log(
        `end`,
        moment
          .utc()
          .week(weeksInYear)
          .day(7 * (oldWeeksInMonth - 1))
          .hour(0)
          .minute(0)
          .second(0)
      );
      oldOrder = await Order.findAll({
        where: {
          status: 'successful',
          paidAt: {
            [Op.gte]: moment.utc().week(weeksInYear).day(0).hour(0).minute(0).second(0),
            [Op.lt]: moment
              .utc()
              .week(weeksInYear)
              .day(7 * (oldWeeksInMonth - 1))
              .hour(0)
              .minute(0)
              .second(0),
          },
        },
      });
    }

    if (selectedTime === 'year') {
      const year = new Date(startTime).getFullYear();

      oldOrder = await Order.findAll({
        where: {
          status: 'successful',
          paidAt: {
            [Op.gte]: new Date(`${year - 1}-01-01`),
            [Op.lt]: new Date(`${year - 1}-12-31`),
          },
        },
      });
    }

    const oldIncome = oldOrder.reduce((acc, item) => acc + +item.amount, 0);
    const orderIncome = order.reduce((acc, item) => acc + +item.amount, 0);

    percent = Math.round(((orderIncome - oldIncome) / oldIncome) * 100);
    // if (!isFinite(percent)) percent = 0; //yesterday=0 and yesterday=0 today=0
    if (oldIncome === 0) percent = 100;
    if (oldIncome === 0 && orderIncome === 0) percent = 0;
    percent = Math.round(percent);

    //* category
    const categoryResult = {
      Foundation: 0,
      Concealer: 0,
      Powder: 0,
      Primer: 0,
      'Eye Brows': 0,
      'Eye Liner': 0,
      'Eye Shadow': 0,
      Mascara: 0,
      'Lip Blam': 0,
      'Lip Liner': 0,
      'Lip Stick': 0,
      'Liquid Lipstick': 0,
      Blush: 0,
      Bronzer: 0,
      Highlighter: 0,
      BodyMakeup: 0,
    };

    const dicTionary = {
      Foundation: 'foundation',
      Concealer: 'concealer',
      Powder: 'powder',
      Primer: 'primer',
      'Eye Brows': 'brow',
      'Eye Liner': 'eyeliner',
      'Eye Shadow': 'shadow',
      Mascara: 'mascara',
      'Lip Blam': 'balm',
      'Lip Liner': 'lip liner',
      'Lip Stick': 'lipstick',
      'Liquid Lipstick': 'liquid',
      Blush: 'blush',
      Bronzer: 'bronzer',
      Highlighter: 'highlighter',
      BodyMakeup: 'body',
    };

    const orderId = [];
    order.forEach((item) => {
      orderId.push(item.id);
    });
    console.log(`orderId`, orderId);

    //*foundation

    for (const [key, value] of Object.entries(categoryResult)) {
      const categoryItem = await OrderItem.findAll({
        where: {
          '$Product.name$': { [Op.like]: `%${dicTionary[key]}%` },
          orderId: { [Op.or]: orderId.length ? orderId : [null] },
        },
        include: [
          {
            model: Product,
            attributes: ['cetagory', 'price'],
          },
        ],
      });
      categoryResult[key] = categoryItem.reduce((acc, item) => acc + +item.quality * item.Product.price, 0);
    }

    const sortCategoryResult = [];
    for (let key in categoryResult) {
      sortCategoryResult.push([key, categoryResult[key]]);
    }

    sortCategoryResult.sort((a, b) => b[1] - a[1]);

    res.json({ order, percent, sortCategoryResult });
  } catch (err) {
    next(err);
  }
};
