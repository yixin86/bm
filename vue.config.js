module.exports = {
    // 默认'/'，部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
}