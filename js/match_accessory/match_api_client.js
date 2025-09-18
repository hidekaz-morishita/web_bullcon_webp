// match_api_client.js

const MATCH_API_URL = '../../api/get_products_compatibility.php';

/**
 * 適合品番情報をAPIから取得する関数。
 * @param {object} params - APIに渡すクエリパラメータ。
 * @returns {Promise<object>} 適合品番データ。
 */
export async function getCompatibilityData(params) {
    const searchParams = new URLSearchParams(params).toString();
    const query = `${MATCH_API_URL}?${searchParams}`;

    try {
        const response = await fetch(query);
        if (!response.ok) {
            throw new Error(`検索に失敗しました。ステータス: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API呼び出し中にエラーが発生しました:', error);
        throw error;
    }
}