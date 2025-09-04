document.addEventListener('DOMContentLoaded', () => {
    const announcementsList = document.getElementById('announcements-list');

    fetch('../../api/get_announcements_title.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const li = document.createElement('li');
                
                // 日付を正規表現を使って正しく解析
                const date_match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
                let formattedDate = '日付不明';
                if (date_match) {
                    const year = date_match[1];
                    const month = date_match[2].padStart(2, '0');
                    const day = date_match[3].padStart(2, '0');
                    formattedDate = `${year}/${month}/${day}`;
                }

                const link = document.createElement('a');
                link.href = item.url;
                
                const dateSpan = document.createElement('span');
                dateSpan.classList.add('announcement-date');
                dateSpan.textContent = formattedDate;

                const titleSpan = document.createElement('span');
                titleSpan.textContent = item.title;

                link.appendChild(dateSpan);
                link.appendChild(titleSpan);
                
                li.appendChild(link);
                announcementsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('お知らせの読み込みに失敗しました:', error);
            announcementsList.innerHTML = '<li>お知らせを読み込めませんでした。</li>';
        });
});