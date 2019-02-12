// import moment from 'moment'
// import crypto from 'crypto'
var moment = require('moment')
var crypto = require('crypto')
// import { appointment } from '../queue/methods/appointment'
// const http = require('http')

//MD5签名
const md5 = str => {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}

const getClientIp = function (req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
}

const checkPhoneNumber = phone => {
  const r = /(1([3456789][0-9]))\d{8}/
  return r.test(phone) && phone.length === 11
}

const checkIdCard = num => {
  num = num.toUpperCase()
  const re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
  let arrSplit = num.match(re)
  let dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
  let bGoodDay
  bGoodDay = dtmBirth.getFullYear() === Number(arrSplit[2]) && dtmBirth.getMonth() + 1 === Number(arrSplit[3]) && dtmBirth.getDate() === Number(arrSplit[4])
  if (!bGoodDay) {
    return false
  } else {
    let valnum
    let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let nTemp = 0,
      i
    for (i = 0; i < 17; i++) {
      nTemp += num.substr(i, 1) * arrInt[i]
    }
    valnum = arrCh[nTemp % 11]
    if (valnum !== num.substr(17, 1)) {
      return false
    }
    return num
  }
}

const subBirthday = certNo => {
  return certNo.substr(6, 4) + '-' + certNo.substr(10, 2) + '-' + certNo.substr(12, 2)
}

const subSex = certNo => {
  return certNo.substr(16, 1) % 2 + ''
}

const getAge = birthDay => {
  return moment().diff(moment(birthDay), 'year')
}

const createTradeNo = () => {
  let sec = Math.round(new Date().getTime() / 1000) - new Date('2017').getTime()
  let r1 = (Math.random() + '').substr(4, 2)
  let r2 = (Math.random() + '').substr(4, 3)
  let r3 = (Math.random() + '').substr(4, 3)
  let r4 = (Math.random() + '').substr(4, 3)
  let r = (('1' + r1 + r2 + r3 + r4) * 1).toString(36)
  return (sec.toString(36) + r).toUpperCase()
}

const createAfterNo = () => {
  let date = moment().format('YYYYMMDDHHmmss') * 1
  let r1 = (Math.random() + '').substr(4, 4)
  let r = (date * 1).toString(32) + (r1 * 1).toString(32)
  return r.toUpperCase()
}

const createTransactionNo = () => {
  let date = moment().format('YYYYMMDDHHmmss')
  let sss = moment().format('SSS')
  sss = secondsFormat(sss, 3)
  let r1 = (Math.random() + '').substr(4, 3)
  let r2 = (Math.random() + '').substr(4, 3)
  let r3 = (Math.random() + '').substr(4, 3)
  let r4 = (Math.random() + '').substr(4, 3)
  return date + sss + r1 + r2 + r3 + r4
}

let reservationCode = {}
const createReservationCode = async () => {
  let year = moment().format('YY') * 1 - 16
  let days = moment().format('DDD')
  let seconds = moment().format('HH') * 60 * 60 + moment().format('mm') * 60 + moment().format('ss') * 1
  const prefix = '_',
    codeBoss = prefix + seconds
  if (reservationCode[codeBoss]) {
    if (reservationCode[codeBoss].length) return year + secondsFormat(days, 3) + secondsFormat(seconds + '', 5) + reservationCode[codeBoss].pop()
    await sleep(100)
    return await createReservationCode()
  } else {
    reservationCode = {}
    reservationCode[codeBoss] = createReservationCode4Second(10, 1)
    return await createReservationCode()
  }
}




function createReservationCode4Second(max, length) {
  let arr = []
  for (; max > 0;) arr.push(secondsFormat(--max + '', length))
  return arr
}

function secondsFormat(str, length) {
  if (str.length >= length) {
    return str
  } else {
    for (; str.length < length;) {
      str = '0' + str
    }
    return str
  }
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
** yuejingge 2017/11/8
*/

const randomWord = (randomFlag, min, max) => {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;// 任意长度
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}


//建议就诊时间往前推多少时间
const formatBDTime = ({ time, begin }) => {
  console.log('建议就诊时间往前推多少时间', time, begin)
  if (!time) return '';
  let datetimes = time.split('-');
  let start = [];
  for (let i = 0; i < datetimes.length; i++) {
    const time = datetimes[i];
    let items = time.split(':');
    let hh = items[0] * 1;
    let mm = items[1] * 1;
    let bh = hh;
    let bm = mm - begin * 1;
    if (bm < 0) {
      bm = 60 + bm;
      bh--;
    }
    if (bm < 10) {
      bm = '0' + bm;
    }
    if (bh < 10) {
      bh = '0' + bh;
    }
    let cc = bh + ':' + bm
    start.push(cc)
  }
  console.log('就诊时间', start[0] + '-' + start[1])
  return start[0] + '-' + start[1]
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 判断是否为iPhone
 * @param {*} userAgent
 */
const isIPhone = userAgent => {
  if (/iPhone|iPod|iPad/i.test(userAgent)) {
    return true
  }
  return false
}

const getInsertId = upsertResult => {
  const { lastErrorObject, value } = upsertResult
  let insertId
  if (value) {
    insertId = value._id
  } else {
    insertId = lastErrorObject.upserted
  }
  return insertId
}

const refund = async (payment, Payment, Refund, alipayRefundUrl, wechatRefundUrl, rp) => {
  return Payment.refund(payment._id)
  // console.log('进入退款的函数*********************refund')
  // let url, json;
  // const headers = { 'Content-Type': 'application/json' };
  // let refundFee = (payment.totalFee * 1).toFixed(2);
  // let outTradeNo = payment.outTradeNo;
  // let tradeNo = payment.tradeNo;
  // if (payment.payWay === 'ALIPAY') {
  //   url = alipayRefundUrl;
  //   json = { refundFee, outTradeNo, tradeNo };
  // } else if (payment.payWay === 'WECHAT') {
  //   url = wechatRefundUrl;
  //   //refundFee *= 100;
  //   json = { refundFee, outTradeNo, tradeNo, type: 0 };
  // } else if (payment.payWay === 'NATIVE') {
  //   url = wechatRefundUrl;
  //   //refundFee *= 100;
  //   json = { refundFee, outTradeNo, tradeNo, type: 1 };
  // }
  // let options = {
  //   method: 'POST',
  //   uri: url,
  //   json: json,
  //   headers: headers
  // };
  // console.log(options);
  // console.log(refundFee);
  // const result = await rp(options);
  // console.log('进入退费ForCancel-----------' + result.code);
  // if (result.code !== '200') {
  //   // updateRefund(Refund, {payment, refund_status: false})
  //   throw new Error('退款失败-------' + result.message);
  // }
  // console.log(result.messages);
  // Payment.updateById(payment._id, { status: 'REFUND_SUCCESS' });
  // updateRefund(Refund, {payment, refund_status: true})
}

async function updateRefund(Refund, { payment, refund_status }) {
  if (!Refund) throw Error('参数错误 Refund' + Refund)
  if (!payment) throw Error('创建refund失败, 参数错误' + payment + refund_status)
  var { paymentId, totalFee, typeName, typeInfo, outTradeNo, tradeNo, payWay } = payment
  var refund = await Refund.findByOps({ paymentId })
  if (refund) {
    // refund存在修改状态
    Refund.updateById(refund._id, {
      refund_status: refund_status
    })
  } else {
    // refund不存在创建
    let refund_id = await Refund.insert(
      Object.assign(
        {},
        {
          paymentId,
          tradeNo,
          payWay,
          outTradeNo,
          typeInfo,
          typeName,
          totalFee: totalFee * 1,
          refund_status
        }
      )
    )
    if (!refund_id) {
      console.log('插入refund失败' + paymentId)
    }
  }
}

// 格式化单个科室
const formatAppointment = (appointment, { amPaymentApmTimeLimit, pmPaymentApmTimeLimit }) => {
  let now = moment().format('HH:mm'),
    today = moment().format('YYYY-MM-DD')
  if (today === moment(appointment.visitDate).format('YYYY-MM-DD')) {
    if (amPaymentApmTimeLimit && (appointment.amPm === 'a' || appointment.amPm === 'am' || appointment.amPm === '上午')) {
      if (now > amPaymentApmTimeLimit) {
        // 过期
        appointment.visitStatus = '05'
        appointment.payStatus = true
      }
    }
    if (pmPaymentApmTimeLimit && (appointment.amPm === 'p' || appointment.amPm === 'pm' || appointment.amPm === '下午')) {
      if (now > pmPaymentApmTimeLimit) {
        appointment.visitStatus = '05'
        appointment.payStatus = true
      }
    }
  } else if (today > moment(appointment.visitDate).format('YYYY-MM-DD')) {
    appointment.visitStatus = '05'
  }
  return appointment
}
// 格式化科室列表
const formatAppointments = (appointments, { amPaymentApmTimeLimit, pmPaymentApmTimeLimit }) => {
  for (let i = 0; i < appointments.length; i++) appointments[i] = formatAppointment(appointments[i], { amPaymentApmTimeLimit, pmPaymentApmTimeLimit })
  return appointments
}

// 格式化医生
const formatDoctor = (doctor, department) => {
  if (!doctor.doctorName) doctor.doctorName = department.deptName
  return doctor
}

// 格式化医生列表
const formatDoctors = (doctors, department) => {
  for (let i = 0; i < doctors.length; i++) doctors[i] = formatDoctor(doctors[i], department)
  return doctors
}

// 格式化预约医生
const formatDoctorNew = (doctor, department) => {
  if (!doctor.doctorName) {
    if (!doctor.group_name) {
      doctor.doctorName = '门诊号'
    }
    else {
      doctor.doctorName = '门诊号'//(' + doctor.group_name + ')'
    }
    //department.deptName
  }
  else {
    if (!doctor.group_name) {
      doctor.doctorName = doctor.doctorName
    }
    else {
      doctor.doctorName = doctor.doctorName //+ '(' + doctor.group_name + ')'
    }
  }
  console.log('格式化预约医生', JSON.stringify(doctor))

  return doctor
}

// 格式化预约医生列表
const formatDoctorNews = (doctors, department) => {
  for (let i = 0; i < doctors.length; i++) {
    doctors[i] = formatDoctorNew(doctors[i], department)
  }
  console.log('格式化预约医生列表', doctors, doctors.length)
  return doctors
}


const downloadPic = url => {
  return new Promise((resolve, reject) => {
    let req = http.get(url, function (resu) {
      let imgData = ''
      resu.setEncoding('binary')
      resu.on('data', function (chunk) {
        imgData += chunk
      })
      resu.on('end', function () {
        let picUrl = new Buffer(imgData, 'binary').toString('base64')
        resolve(picUrl)
      })
    })
    req.on('error', function (err) {
      console.log('下载图片失败', err)
      return reject(err)
    })
    req.end()
  })
}

//去重
 const array_remove_repeat = array => {
  let r = []
  for (let i = 0; i < array.length; i++) {
    let flag = true
    let temp = array[i]
    for (let j = 0; j < r.length; j++) {
      if (JSON.stringify(temp) === JSON.stringify(r[j])) {
        flag = false
        break
      }
    }
    if (flag) {
      r.push(temp)
    }
  }
  return r
}

 const formatFee = (fee, useCentUnit = false) => {
  if ((fee + '').indexOf('.') > -1) fee += '0001'
  else fee += '.0001'
  let constant = 100
  if (useCentUnit) constant = 1
  return (Math.round((fee * 100))) / constant
}


console.log('aaa',createReservationCode().then());
