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
            // 新しい順に日付で並び替え
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                const dateB = new Date(b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                return dateB - dateA;
            });

            // 現在の日付から2週間前の日付を計算
            const currentDate = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(currentDate.getDate() - 7);
            
            sortedData.forEach(item => {
                const li = document.createElement('li');
                
                // 日付を正規表現を使って正しく解析し、Dateオブジェクトに変換
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
                titleSpan.classList.add('announcement-title-text'); // クラス名を追加して識別しやすく
                titleSpan.textContent = item.title;

                link.appendChild(dateSpan);
                link.appendChild(titleSpan);

                // Newバッジのロジック 
                const announcementDate = new Date(date_match[1], date_match[2] - 1, date_match[3]);
                if (announcementDate > oneWeekAgo) {
                    const newBadge = document.createElement('span');
                    newBadge.textContent = 'New';
                    
                    Object.assign(newBadge.style, {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        backgroundColor: 'red',
                        borderRadius: '10px',
                        padding: '1px 5px 2px 5px',
                        marginLeft: '15px'
                    });
                    
                    link.appendChild(newBadge);
                }
                
                li.appendChild(link);
                announcementsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('お知らせの読み込みに失敗しました:', error);
            announcementsList.innerHTML = '<li>お知らせを読み込めませんでした。</li>';
        });
});

/* for debug */
// document.addEventListener('DOMContentLoaded', () => {
//     const announcementsList = document.getElementById('announcements-list');

//     const tmpData = [
//         {"date": "1990年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1991年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1992年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1993年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1994年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1995年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "1996年2月4日", "title": "tesuto dayo", "url" : "/"},
//         {"date": "2025年9月8日", "title": "tesuto dayo", "url" : "/"},
//     ];
//     // 新しい順に日付で並び替え
//     const sortedData = tmpData.sort((a, b) => {
//         const dateA = new Date(a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
//         const dateB = new Date(b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
//         return dateB - dateA;
//     });
//     // 現在の日付から1週間前の日付を計算
//     const currentDate = new Date();
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(currentDate.getDate() - 7);
    
//     sortedData.forEach(item => {
//         const li = document.createElement('li');
        
//         // 日付を正規表現を使って正しく解析し、Dateオブジェクトに変換
//         const date_match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
//         let formattedDate = '日付不明';
//         if (date_match) {
//             const year = date_match[1];
//             const month = date_match[2].padStart(2, '0');
//             const day = date_match[3].padStart(2, '0');
//             formattedDate = `${year}/${month}/${day}`;
//         }
//         const link = document.createElement('a');
//         link.href = item.url;
        
//         const dateSpan = document.createElement('span');
//         dateSpan.classList.add('announcement-date');
//         dateSpan.textContent = formattedDate;
//         const titleSpan = document.createElement('span');
//         titleSpan.classList.add('announcement-title-text'); // クラス名を追加して識別しやすく
//         titleSpan.textContent = item.title;
//         link.appendChild(dateSpan);
//         link.appendChild(titleSpan);
//         // Newバッジのロジック 
//         const announcementDate = new Date(date_match[1], date_match[2] - 1, date_match[3]);
//         if (announcementDate > oneWeekAgo) {
//             const newBadge = document.createElement('span');
//             newBadge.textContent = 'New';
            
//             Object.assign(newBadge.style, {
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 fontSize: '12px',
//                 backgroundColor: 'red',
//                 borderRadius: '10px',
//                 padding: '1px 5px 2px 5px',
//                 marginLeft: '15px'
//             });
            
//             link.appendChild(newBadge);
//         }
        
//         li.appendChild(link);
//         announcementsList.appendChild(li);
//     });
// });