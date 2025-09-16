// 検索対象の製品情報と、それに紐づく適合表のカラム情報をオプションタイプ別に定義
export const PRODUCTS_DATA = {
    'FreeTVing': {
        name: 'フリーテレビング/テレナビング',
        productKey: 'televing',
        optionFlows: {
            'maker': {
                processType: 'carModel',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/TVing/TVing_New_m_toyota.pdf',
                    'レクサス': '../../pdf/products/TVing/TVing_New_m_lexus.pdf',
                    'ニッサン': '../../pdf/products/TVing/TVing_New_m_nissan.pdf',
                    'マツダ': '../../pdf/products/TVing/TVing_New_m_mazda.pdf',
                    'スバル': '../../pdf/products/TVing/TVing_New_m_subaru.pdf',
                    'スズキ': '../../pdf/products/TVing/TVing_New_m_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/TVing/TVing_New_m_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/TVing/TVing_New_m_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'フリーテレビング', subHeaders: [
                        { key: 'ft_auto_type', label: 'オートタイプ',
                            priceKeys: { excl: 'ft_auto_price_excl_tax', incl: 'ft_auto_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position'}
                         },
                        { key: 'ft_led_switch_type', label: 'LEDスイッチ切替タイプ', 
                            priceKeys: { excl: 'ft_led_price_excl_tax', incl: 'ft_led_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position', dvd: 'ft_led_sh_st_dvd_playback'}
                        },
                        { key: 'ft_service_hole_switch_type', label: 'サービスホールスイッチ切替タイプ',
                            priceKeys: { excl: 'ft_service_hole_price_excl_tax', incl: 'ft_service_hole_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position', dvd: 'ft_led_sh_st_dvd_playback'}
                        },
                        { key: 'ft_steering_switch_type', label: 'ステアリングスイッチ切替タイプ', 
                            priceKeys: { excl: 'ft_steering_price_excl_tax', incl: 'ft_steering_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position', dvd: 'ft_led_sh_st_dvd_playback'}
                        },
                    ]},
                    { label: 'テレナビング', subHeaders: [
                        { key: 'nav_product_number', label: 'LEDスイッチ切替タイプ',
                            priceKeys: { excl: 'nav_price_excl_tax', incl: 'nav_price_incl_tax' }, option:{dvd: 'nav_dvd_playback_2'} },
                        { key: 'nav_product_number_2', label: 'nav_col_2',
                            priceKeys: { excl: 'nav_price_excl_tax_2', incl: 'nav_price_incl_tax_2' }, option:{dvd: 'nav_dvd_playback_2'} },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
            'dealer': {
                processType: 'dealerYears',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/TVing/TVing_New_d_toyota.pdf',
                    'レクサス': '../../pdf/products/TVing/TVing_New_d_lexus.pdf',
                    'ニッサン': '../../pdf/products/TVing/TVing_New_d_nissan.pdf',
                    'マツダ': '../../pdf/products/TVing/TVing_New_d_mazda.pdf',
                    'スバル': '../../pdf/products/TVing/TVing_New_d_subaru.pdf',
                    'スズキ': '../../pdf/products/TVing/TVing_New_d_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/TVing/TVing_New_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/TVing/TVing_New_d_mitsubishi.pdf'
                },
                header: [
                    { label: 'モニター情報', subHeaders: [
                        { key: 'maker', label: 'メーカー' },
                        { key: 'year', label: 'モデル年' },
                        { key: 'model_number', label: 'モニター型番' },
                    ]},
                    { label: 'フリーテレビング', subHeaders: [
                        { key: 'ft_auto_type', label: 'オートタイプ', priceKeys: { excl: 'ft_auto_price_excl_tax', incl: 'ft_auto_price_incl_tax' } },
                        { key: 'ft_auto_navigation_control', label: 'ナビ操作' },
                        { key: 'ft_auto_vehicle_position', label: '自車位置' },
                        { key: 'ft_led_switch_type', label: 'LEDスイッチ切替タイプ', priceKeys: { excl: 'ft_led_price_excl_tax', incl: 'ft_led_price_incl_tax' } },
                        { key: 'ft_service_hole_switch_type', label: 'サービスホールスイッチ切替タイプ', priceKeys: { excl: 'ft_service_hole_price_excl_tax', incl: 'ft_service_hole_price_incl_tax' } },
                        { key: 'ft_steering_switch_type', label: 'ステアリングスイッチ切替タイプ', priceKeys: { excl: 'ft_steering_switch_price_excl_tax', incl: 'ft_steering_switch_price_incl_tax' } },
                        { key: 'ft_led_sh_st_navigation_control', label: 'ナビ操作' },
                        { key: 'ft_led_sh_st_vehicle_position', label: '自車位置' },
                        { key: 'ft_led_sh_st_dvd_playback', label: 'DVD視聴' },
                    ]},
                    { label: 'テレナビング', subHeaders: [
                        { key: 'nav_product_number', label: '品番 1', priceKeys: { excl: 'nav_price_excl_tax', incl: 'nav_price_incl_tax' } },
                        { key: 'nav_product_number_2', label: '品番 2', priceKeys: { excl: 'nav_price_excl_tax_2', incl: 'nav_price_incl_tax_2' } },
                        { key: 'nav_dvd_playback_2', label: 'DVD視聴' },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            }
        }
    },
};