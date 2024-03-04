const USER_BADGES = [
    { type: 'normal', monthly_debit_limit: 0 },
    { type: 'vip', monthly_debit_limit: 1000 },
    { type: 'vvip', monthly_debit_limit: 2000 },
    { type: 'svip', monthly_debit_limit: 5000 },
]
const HOST_BADGES = [
    { type: '0', monthly_credit_limit: 0 },
    { type: '5', monthly_credit_limit: 1000 },
    { type: '4', monthly_credit_limit: 2000 },
    { type: '3', monthly_credit_limit: 3000 },
    { type: '2', monthly_credit_limit: 5000 },
    { type: '1', monthly_credit_limit: 10000 },
]

module.exports = { USER_BADGES, HOST_BADGES }