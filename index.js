window.onload = function() {
    // 下载链接
    let url = 'https://mcbdhrnw.s3.ap-east-1.amazonaws.com/Chenmdsomer.zip'

    document.querySelectorAll('.download').forEach(item => {
        item.onclick = function() {
            location.href = url
        }
    })
}
