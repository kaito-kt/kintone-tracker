// ここにあなたのKintone情報（サブドメイン、アプリID、APIトークン）を記入
const KINTONE_SUBDOMAIN = 'tokaiseibi';
const KINTONE_APP_ID = '124';
const KINTONE_API_TOKEN = 'jeOOli5pz6Sg8oP4g6q8q1rHSfynL6gfgUvrrd2s';
const VEHICLE_ID = 'デモ'; // 例: ''

// Kintoneにデータを送信する関数
function sendLocationToKintone() {
    // 緯度経度情報の取得を試みる
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const now = new Date();
                const recordBody = {
                    'app': KINTONE_APP_ID,
                    'record': {
                        'user_id': {'value': VEHICLE_ID},
                        'latitude': {'value': position.coords.latitude},
                        'longitude': {'value': position.coords.longitude},
                        'accuracy': {'value': position.coords.accuracy},
                        '取得日時': {'value': now.toISOString()}
                    }
                };

                const headers = {
                    'X-Cybozu-API-Token': KINTONE_API_TOKEN,
                    'Content-Type': 'application/json'
                };

                // KintoneのREST APIにPOSTリクエストを送信
                fetch(`https://${KINTONE_SUBDOMAIN}/k/v1/record.json`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(recordBody)
                })
                .then(response => response.json())
                .then(data => console.log('送信成功:', data))
                .catch((error) => console.error('送信失敗:', error));
            },
            (error) => {
                console.error('GPSエラー:', error);
            }
        );
    } else {
        console.error('ブラウザがGPSに対応していません。');
    }
}

// 2分ごと（120000ミリ秒）に上記の関数を呼び出す
setInterval(sendLocationToKintone, 120000);