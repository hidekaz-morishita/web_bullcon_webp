// 検索対象の製品情報と、それに紐づく適合表のカラム情報をオプションタイプ別に定義
export const PRODUCTS_DATA = {
    'freeTVing': {
        name: 'フリーテレビング/テレナビング',
        productKey: 'televing',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/TVing/TVing_New_m_toyota.pdf',
                    'レクサス': '../../pdf/products/TVing/TVing_New_m_lexus.pdf',
                    'ニッサン': '../../pdf/products/TVing/TVing_New_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/TVing/TVing_New_m_honda.pdf',
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
                            option: {nav: 'ft_auto_navigation_control', vehicle_pos: 'ft_auto_vehicle_position'}
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
                processType: 'dealer_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/TVing/TVing_New_d_toyota.pdf',
                    'レクサス': '../../pdf/products/TVing/TVing_New_d_lexus.pdf',
                    'ニッサン': '../../pdf/products/TVing/TVing_New_d_nissan.pdf',
                    'ホンダ': '../../pdf/products/TVing/TVing_New_d_honda.pdf',
                    'マツダ': '../../pdf/products/TVing/TVing_New_d_mazda.pdf',
                    'スバル': '../../pdf/products/TVing/TVing_New_d_subaru.pdf',
                    'スズキ': '../../pdf/products/TVing/TVing_New_d_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/TVing/TVing_New_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/TVing/TVing_New_d_mitsubishi.pdf'
                },
                header: [
                    { label: 'モニター情報', subHeaders: [
                        { key: 'year', label: 'モデル年' },
                        { key: 'monitor_number', label: 'モニター型番' },
                        { key: 'specification', label: '特徴' },
                    ]},
                    { label: 'フリーテレビング', subHeaders: [
                        { key: 'ft_auto_type', label: 'オートタイプ',
                            priceKeys: { excl: 'ft_auto_price_excl_tax', incl: 'ft_auto_price_incl_tax' },
                            option: {nav: 'ft_auto_navigation_control', vehicle_pos: 'ft_auto_vehicle_position'}
                         },
                        { key: 'ft_led_switch_type', label: 'LEDスイッチ切替タイプ', 
                            priceKeys: { excl: 'ft_led_price_excl_tax', incl: 'ft_led_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position', dvd: 'ft_led_sh_st_dvd_playback'}
                        },
                        { key: 'ft_service_hole_switch_type', label: 'サービスホールスイッチ切替タイプ',
                            priceKeys: { excl: 'ft_service_hole_price_excl_tax', incl: 'ft_service_hole_price_incl_tax' },
                            option: {nav: 'ft_led_sh_st_navigation_control', vehicle_pos: 'ft_led_sh_st_vehicle_position', dvd: 'ft_led_sh_st_dvd_playback'}
                        }
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
            }
        }
    },
    'magicone_bk_un': {
        name: 'バックカメラ接続ユニット',
        productKey: 'magicone_bk_un',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_c_m_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_c_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_c_m_honda.pdf',
                    'マツダ': '../../pdf/products/MAGICONE/magicone_c_m_mazda.pdf',
                    'スバル': '../../pdf/products/MAGICONE/magicone_c_m_subaru.pdf',
                    'スズキ': '../../pdf/products/MAGICONE/magicone_c_m_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_c_m_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_c_m_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'バックカメラ接続ユニット', subHeaders: [
                        { key: 'un_product_number_1', label: '品番１',
                            priceKeys: { excl: 'un_price_excl_tax_1', incl: 'un_price_incl_tax_1' },
                         },
                        { key: 'un_product_number_2', label: '品番2', 
                            priceKeys: { excl: 'un_price_excl_tax_2', incl: 'un_price_incl_tax_2' },
                        },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
            'dealer': {
                processType: 'dealer_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_c_d_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_c_d_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_c_d_honda.pdf',
                    'マツダ': '../../pdf/products/MAGICONE/magicone_c_d_mazda.pdf',
                    'スバル': '',
                    'スズキ': '../../pdf/products/MAGICONE/magicone_c_d_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_c_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_c_d_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'year', label: 'モデル年' },
                        { key: 'monitor_number', label: 'モニター型番' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'バックカメラ接続ユニット', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'un_price_excl_tax_1', incl: 'un_price_incl_tax_1' },
                         }                        
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    },
    'magicone_bk_ha': {
        name: 'バックカメラ接続ハーネス',
        productKey: 'magicone_bk_ha',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_c_m_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_c_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_c_m_honda.pdf',
                    'マツダ': '../../pdf/products/MAGICONE/magicone_c_m_mazda.pdf',
                    'スバル': '../../pdf/products/MAGICONE/magicone_c_m_subaru.pdf',
                    'スズキ': '../../pdf/products/MAGICONE/magicone_c_m_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_c_m_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_c_m_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'バックカメラ接続ハーネス', subHeaders: [
                        { key: 'ha_product_number_1', label: '品番',
                            priceKeys: { excl: 'ha_price_excl_tax_1', incl: 'ha_price_incl_tax_1' },
                         },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
            'dealer': {
                processType: 'dealer_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_c_d_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_c_d_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_c_d_honda.pdf',
                    'マツダ': '../../pdf/products/MAGICONE/magicone_c_d_mazda.pdf',
                    'スバル': '',
                    'スズキ': '../../pdf/products/MAGICONE/magicone_c_d_suzuki.pdf',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_c_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_c_d_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'year', label: 'モデル年' },
                        { key: 'monitor_number', label: 'モニター型番' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'バックカメラ接続ハーネス', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'ha_price_excl_tax_1', incl: 'ha_price_incl_tax_1' },
                         }                        
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    },
    'magicone_rm_un': {
        name: 'リアモニター出力ユニット',
        productKey: 'magicone_rm_un',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_r_m_toyota.pdf',
                    'レクサス': '../../pdf/products/MAGICONE/magicone_r_m_lexus.pdf',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_r_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_r_m_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '',
                    'ミツビシ': ''
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'モニター情報', subHeaders: [
                        { key: 'monitor_number', label: 'モニター型番' },
                    ]},
                    { label: 'リアモニター出力ユニット', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' },
                         },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            }
        }
    },
    'magicone_rm_ha': {
        name: 'リアモニター出力ハーネス',
        productKey: 'magicone_rm_ha',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_r_m_toyota.pdf',
                    'レクサス': '../../pdf/products/MAGICONE/magicone_r_m_lexus.pdf',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_r_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_r_m_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '',
                    'ミツビシ': ''
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'リアモニター出力ハーネス', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' },
                            option: {excl_input: 'input', tv: 'tv', dvd: 'dvd'}
                         },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
            'dealer': {
                processType: 'dealer_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_r_d_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_r_d_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_r_d_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_r_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_r_d_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'year', label: 'モデル年' },
                        { key: 'monitor_number', label: 'モニター型番' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'リアモニター出力ハーネス', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' },
                            option: {excl_input: 'input', tv: 'tv', dvd: 'dvd'}
                         }                        
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    },
    'magicone_vtr_hdmi': {
        name: 'VTR/HDMI ハーネス',
        productKey: 'magicone_vtr_hdmi',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_r_m_toyota.pdf',
                    'レクサス': '../../pdf/products/MAGICONE/magicone_r_m_lexus.pdf',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_r_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_r_m_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '',
                    'ミツビシ': ''
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'RCA接続品番', subHeaders: [
                        { key: 'product_number_1', label: '品番1',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' }
                        },
                        { key: 'product_number_2', label: '品番2',
                            priceKeys: { excl: 'price_excl_tax_2', incl: 'price_incl_tax_2' }
                        },
                    ]},
                    { label: 'HDMI接続品番', subHeaders: [
                        { key: 'product_number_3', label: '品番3',
                            priceKeys: { excl: 'price_excl_tax_3', incl: 'price_incl_tax_3' },
                        },
                        { key: 'product_number_4', label: '品番4',
                            priceKeys: { excl: 'price_excl_tax_4', incl: 'price_incl_tax_4' },
                        },
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
            'dealer': {
                processType: 'dealer_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/MAGICONE/magicone_r_d_toyota.pdf',
                    'レクサス': '',
                    'ニッサン': '../../pdf/products/MAGICONE/magicone_r_d_nissan.pdf',
                    'ホンダ': '../../pdf/products/MAGICONE/magicone_r_d_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '../../pdf/products/MAGICONE/magicone_r_d_daihatsu.pdf',
                    'ミツビシ': '../../pdf/products/MAGICONE/magicone_r_d_mitsubishi.pdf'
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'year', label: 'モデル年' },
                        { key: 'monitor_number', label: 'モニター型番' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'RCA/HDMI 入力ハーネス', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' }
                         }                        
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    },
    'camera_selector': {
        name: 'カメラセレクター',
        productKey: 'camera_selector',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/CAMERA/AV-CSml.pdf',
                    'レクサス': '',
                    'ニッサン': '',
                    'ホンダ': '',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '',
                    'ミツビシ': ''
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'カメラセレクター', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' }
                        }
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    },
    'steering_switch_controller': {
        name: 'ステアリングスイッチコントローラー',
        productKey: 'steering_swt_ctrl',
        optionFlows: {
            'maker': {
                processType: 'maker_process',
                pdf_paths: {
                    'トヨタ': '../../pdf/products/AV_ACCESSORY/swc_m_toyota.pdf',
                    'レクサス': '../../pdf/products/AV_ACCESSORY/swc_m_lexus.pdf',
                    'ニッサン': '../../pdf/productsAV_ACCESSORY/swc_m_nissan.pdf',
                    'ホンダ': '../../pdf/products/AV_ACCESSORY/swc_m_honda.pdf',
                    'マツダ': '',
                    'スバル': '',
                    'スズキ': '',
                    'ダイハツ': '',
                    'ミツビシ': ''
                },
                header: [
                    { label: '車両情報', subHeaders: [
                        { key: 'car_model', label: '車名' },
                        { key: 'print_date', label: '年式' },
                        { key: 'model_number', label: '型式' },
                        { key: 'specification', label: '仕様' },
                    ]},
                    { label: 'ステアリングスイッチコントローラー/切替ユニット', subHeaders: [
                        { key: 'product_number_1', label: '品番',
                            priceKeys: { excl: 'price_excl_tax_1', incl: 'price_incl_tax_1' }
                        }
                    ]},
                    { label: '注意事項', subHeaders: [
                        { key: 'notes', label: '備考' }
                    ]}
                ]
            },
        }
    }
};

export const BASIC_YEARS = [
    '2025(R07)', '2024(R06)', '2023(R05)', '2022(R04)', '2021(R03)', '2020(R02)',
    '2019(H31/R01)',
    '2018(H30)', '2017(H29)', '2016(H28)', '2015(H27)', '2014(H26)', '2013(H25)',
    '2012(H24)', '2011(H23)', '2010(H22)', '2009(H21)', '2008(H20)', '2007(H19)',
    '2006(H18)', '2005(H17)', '2004(H16)', '2003(H15)', '2002(H14)', '2001(H13)',
    '2000(H12)', '1999(H11)'
];

export const CAR_YEARS = [
    "R7 / 2025", "R6 / 2024", "R5 / 2023", "R4 / 2022", "R3 / 2021", "R2 / 2020",
    "R1 / 2019", "H31 / 2019",
    "H30 / 2018", "H29 / 2017", "H28 / 2016", "H27 / 2015", "H26 / 2014",
    "H25 / 2013", "H24 / 2012", "H23 / 2011", "H22 / 2010", "H21 / 2009",
    "H20 / 2008", "H19 / 2007", "H18 / 2006", "H17 / 2005", "H16 / 2004",
    "H15 / 2003", "H14 / 2002", "H13 / 2001", "H12 / 2000"
];

// 月の固定データ
export const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export const TVING_NOTES_DATA = {
    "common": [
        "車両メーカーの仕様変更等により正常に作動しなくなる場合があります。",
        "「Apple CarPlay」「Android Auto」等、アプリの作動は未確認です。",
        "サービスホールスイッチタイプの適合が記載されている場合は、車両にサービスホールの空きやサイズをご確認ください。サービスホールの空やサイズが異なる場合にはお取り付けできません。"
    ],
    "1": "フリーテレビングでナビゲーション操作が可能になります。",
    "2": "パーキングブレーキアラーム機能により、TV画面に「パーキングブレーキをご確認下さい」と表示される場合がありますので、ナビゲーション本体の設定でこの機能を停止して下さい。",
    "3": "TV視聴には「TV」オプションサービスが必要な場合があります。",
    "4": "DVD視聴には「CD・DVDデッキ」のオプションが必要な場合があります。",
    "5": "ハイブリッド車は「エコ情報」画面でタイヤが回転しなくなる場合があります。",
    "6": "走行中、画面表示がナビゲーションの場合、車両側TVボタンを押すだけではTV画面に切り替わらない時があります。この場合は車両ステアリングスイッチのモードボタンでTVをご選択すると走行中のTVが視聴可能です。",
    "7": "本製品作動中、ナビゲーションの自車位置が不正確になります。自車位置情報を必要とする機能をご使用の際は本製品を【ノーマルモード】にして自車位置が正確な状態で使用してください。。",
    "8": "本製品作動中、ナビゲーションの自車位置表示は弊社独自の方法で動き、おおよその自車位置を表示します。使用状況や周辺の環境により誤差が生じる場合があります。ナビ自車位置情報に基づく機能は画面に表示している自車位置に基づき作動します。より正確な自車位置情報を必要とする機能をご使用の際は本製品を【ノーマルモード】にして自車位置が正確な状態で使用してください。",
    "9": "車両ナビゲーションの仕様により、本製品作動中、GPSが受信できない状況（トンネル内 等）では自車位置が停止する場合があります。",
    "10": "「レーンチェンジアシスト（LCA）付車」「レーンチェンジアシスト（LCA）無車」をご確認ください。【LCA付車】には【 MS-235/235C/ST-235 】【 CTN-107AS/107ASC/107AST 】を取り付けないでください。誤って取り付けされた場合、「レーンチェンジアシスト（LCA）」などの機能が停止し、メーター内にメッセージが表示されます。レーンチェンジアシスト（LCA）の有無は、マルチインフォメーションディスプレイの「車両設定」メニューから「LCA」表示の有無をご確認ください。",
    "11": "切替スイッチのLEDは車両ECUの起動中は点灯し、ECUスリープモードに移行すると消灯します。車両ECUの状態により点灯又は消灯しますが異常ではありません。",
    "12": "車両のサービスホールに空きスペースがない為「サービスホールスイッチタイプ」の取り付けはできません。",
    "13": "リアエンブレムが【HYBRID SYNERGY DRIVE】の場合は一部改良前車両です。（MS-235/MS-235C/ST-235/CTN-107AS/CTN-107ASC/CTN-107ASTが適合）　リアエンブレムが【●HEV】の場合は一部改良後車両です。（CTN-111AS/CTN-111ASC/CTN-111ASTが適合）",
    "14": "メーカー純正TVチューナーの設定がないため、車両にTV機能がありません。",
    "15": "本製品作動中、はナビゲーション操作も可能となりますが、地図画面は表示されたまま自車位置が不正確になります。その際、車速信号及び自車位置に付随する機能は使用出来なくなりますが故障ではありません。（ エネルギーモニター画面での走行中タイヤ回転・自車位置表示・ルート案内・到着予想時刻・残距離表示等）",
    "16": "サービスホールスイッチタイプの場合は、車種毎にパネルのサイズが異なりますので、装着予定車両のパネルサイズと「パネル埋め込みスイッチサイズ確認（PDF）」でサイズをご確認の上お買い求めください。",
    "17": "ナビゲーションの機能により画面に「車速信号が検出できません。車速信号コードの接続をご確認ください。」の文字が表示される場合がありますが、LED消灯（ノーマル状態）にしていただくと表示されません。",
    "18": "パーキングブレーキ操作を行った際、一瞬TV画面が黒くなる場合がありますが異常ではありません。",
    "19": "エネルギーモニターの画面で走行中タイヤが回転しなくなりますが、故障ではありません。",
    "20": "燃費計算ができなくなりますのでご注意下さい。",
    "21": "ディスプレイオーディオにナビゲーション機能がありません。",
    "22": "テレビ視聴中は燃費計算に誤差が生じます。",
    "23": "スイッチ点灯中（テレビ視聴モード）は、自車位置が不正確になります。",
    "24": "緑LED（テレビ視聴モード）のままナビゲーション操作も可能です。",
    "25": "取り付け場所は上部モニター裏となります。",
    "26": "TV視聴/ナビ操作はスイッチ切り替えタイプになりますので、TV視聴モード中及びナビゲーション操作モード中は自車位置が不正確に（停止）になる為、「プロパイロット2.0」「プロパイロット（ナビリンク機能付き）」「ナビ協調機能」「EVメニュー」などは使用できなくなるまたは、使用に制限がかかりますので、必ず橙LED（ノーマルモード）でご使用ください。",
    "27": "TV視聴/ナビ操作はスイッチ切り替えタイプになりますので、TV視聴モード中及びナビゲーション操作モード中は自車位置が不正確になります。テレビ視聴モード中はナビゲーションの自車位置が不正確になる為、地図情報に基づく機能などは使用できません",
    "28": "R1/8以前の登録車両であっても「NISSAN」エンブレム装着車は【CTN-202】が適合になります。",
    "29": "クリッパー/クリッパーリオ/アトラスについては適合対象外となりますのでご注意下さい。",
    "30": "パーキングブレーキアラーム機能が作動する場合は、ナビゲーション本体の設定でこの機能を停止して下さい。",
    "31": "テレビが映る状態では下記の機能・項目が使用できなくなります。<機能>ノーズビューカメラ、リアビューカメラ＜項目＞走行情報、環境情報、メンテナンス、アクセサリー等",
    "32": "ekシリーズ/デリカミニ以外は適合対象外となりますのでご注意下さい。",
    "33": "緑LED（テレビ視聴モード）のままナビゲーション操作も可能です。TV視聴/ナビ操作はスイッチ切り替えタイプになりますので、TV視聴モード中及びナビゲーション操作モード中は自車位置が不正確になります。TV視聴モード中、ナビゲーションの自車位置が不正確になる為、「マイパイロット内のナビリンク機能」等、地図情報に基づく機能などは使用できなくなります。",
    "34": "R7/2～はパネルの一部がネジ止めになっていますので脱着の際はご注意ください。",
    "35": "デリカ D:5　ナビゲーションの脱着作業において、シフトノブの取り外しが必要になりますが、シフトノブ固定用ネジは再使用できませんので必ず新品をご用意ください。（純正部品番号　2400A596）",
    "36": "「CTN-303」は、「TV視聴：オート/ナビ操作：切替タイプ」です。緑LED（テレビ視聴モード）ではナビゲーション操作は出来ませんので、スイッチを操作し、赤LED（ナビゲーション操作モード）でナビゲーション操作を行ってください。",
    "37": "「CTN-304/CTN-305」は、緑LED（テレビ視聴モード）のままナビゲーション操作も可能です。",
    "38": "パーキングブレーキ操作を行った際、一瞬TV画面にメッセージが表示される場合がありますが、異常ではありません。",
    "39": "「CTN-301」は、マルチビューカメラ装着車の場合、カメラ自動表示機能（車両機能）により車速等でカメラ画面に切り替わります。切り替わる前の表示にしたい場合は画面スイッチ（アイコン）等で切り替えて下さい。",
    "40": "「CTN-302」はカメラ自動表示機能によるカメラ画面は製品により制御され切り替わらず、ナビゲーション画面等が継続表示します。",
    "41": "対応する一部車両で画面が暗くなる症状がありますが、個々の車両の特性によるもので異常ではありません。[対策]・・・黒画面が表示された場合は車両側のナビのスイッチを押した後、テレビのスイッチを再度押すことでテレビ画面が表示されます。",
    "42": "マルチビューカメラ制御機能無：マルチビューカメラ付車の場合、カメラ自動表示機能により車速等でカメラ画面に切り替わります。",
    "43": "マルチビューカメラ制御機能有：ナビモード中、カメラ自動表示機能によるカメラ画面は製品により制御され切り換わらず、ナビゲーション画面等が継続表示します。（テレビ視聴モード中は制御されません。",
    "44": "「CTN-〇〇〇」は「TV視聴：オート/ナビ操作：切替タイプ」です。緑LED（テレビ視聴モード）ではナビゲーション操作は出来ませんので、スイッチを操作し、赤LED（ナビゲーション操作モード）でナビゲーション操作を行ってください。「CTN-〇〇〇S」は「TV視聴：切替/ナビ操作：切替タイプ」です。橙LED（ノーマルモード）ではテレビ視聴及びナビゲーション操作はできませんので、スイッチを操作し、緑LED（テレビ視聴モード）、赤LED（ナビゲーション操作モード）に切り替えてご使用ください。",
    "45": "「CTN-309/CTN-309S」は、本製品のスイッチ操作を行った際、一瞬TV画面にメッセージが表示される場合がありますが異常ではありません。",
    "46": "ステップワゴンに装着する場合、ナビゲーション脱着作業において、フロントピラーガーニッシュの取り外しが必要ですが、ピラーガーニッシュ固定のクリップは再使用できませんので新品クリップをご用意ください。（ホンダ純正番号：91561-T20-A01）",
    "47": "テレビ機能、ナビゲーション機能はありません。外部入力（HDMI）映像を走行中に視聴するための【フリーテレビング】適合となります。",
    "48": "緑LED（テレビ視聴モード）のままナビゲーション操作も可能です。本製品をご使用中は、i-DM エンディング表示のスコア評価とアドバイスが機能しなくなります。（i-DMについての詳細は車両取扱説明書をご参照ください）",
    "49": "TV視聴/ナビ操作はスイッチ切り替えタイプになりますので、TV視聴モード中及びナビゲーション操作モード中は自車位置が不正確になります。",
    "50": "「CX-3」は、H27/3～マツダコネクト7インチセンターディスプレイ装着車 / R3/10～マツダコネクト8インチセンターディスプレイ装着車",
    "51": "車両仕様により本製品作動中、トンネル 等で　メーターに「交通標識認識システム性能が低下しています。ナビゲーションとの連携が出来ません」 「SDカードを確認してください」　と交互に表示される場合があります。本製品をOFF または トンネル通過後しばらく走行すると表示が消えます。",
    "52": "R1/9～R3/9マツダコネクト7インチセンターディスプレイ装着車 / R3/10～マツダコネクト8インチセンターディスプレイ装着車",
    "53": "ディスプレイオーディオ装着車は、テレビチューナー非搭載のため、テレビの視聴はできません。",
    "54": "R7/2～はパネルの一部がネジ止めになっていますので脱着の際はご注意ください。",
    "55": "テレビ視聴にはディーラーオプションの「ＴＶアンテナセット」が必要です。",
    "56": "",
    "57": "",
    "58": "",
    "59": "「BTN-T10」はLEDスイッチ、「BTN-T10A」「BTN-T10C」はサービスホールスイッチです。",
    "60": "「BTN-S31」はLEDスイッチ、「BTN-S31C」はサービスホールスイッチです。",
    "61": "「CTN-307」は「TV視聴：オート/ナビ操作：切替タイプ」です。「CTN-307S」は「TV視聴：切替/ナビ操作：切替タイプ」です。",
    "62": "「CTN-308」は「TV視聴：オート/ナビ操作：切替タイプ」です。「CTN-308S」は「TV視聴：切替/ナビ操作：切替タイプ」です。",
    "63": "「CTN-309」は「TV視聴：オート/ナビ操作：切替タイプ」です。「CTN-309S」は「TV視聴：切替/ナビ操作：切替タイプ」です。",
    "64": "ディスプレイオーディオにTV機能がありません。走行中のUSBの動画再生が可能になります。",
    "65": "【車速センサーが接続されていません。】と表示されますが、異常ではなく、暫くすると表示は消えます。",
    "66": "標準装備のVTR/ipod入力の動画/音楽再生が走行中も可能になります。各種アプリの動作保証は致しかねます。",
    "67": "アルティスについては、適合対象外です。",
    "68": "ステアリングスイッチ（静電式）車は適合不可",
    "901": "アルト・スペーシア・スペーシアベース・ソリオ・ハスラー・ラパン・ワゴンRスマイル 以外の車両",
    "902": "全方位モニター非装着車 【アルト（HA97S R4/1～）】【スペーシア（MK53S R4/1～R5/11）（MK54S 94S R5/12～）】【スペーシアベース（MK33V R4/8～）】【ソリオ（MA27S 37S R2/12～R7/1）（MAD7S R7/2～）】【ハスラー（MR52S 92S R2/2～）】【ラパン（HE33S R4/7～）】【ワゴンRスマイル（MX81S 91S R3/9～）】",
    "903": "全方位モニター装着車 【アルト（HA97S R4/1～）】【スペーシア（MK53S R4/1～R5/11）】【スペーシアベース（MK33V R4/8～）】【ソリオ（MA37S R2/12～R7/1）】【ハスラー（MR52S 92S R2/2～R4/5）】【ラパン（HE33S R4/7～）】【ワゴンRスマイル（MX91S R3/9～）】",

};

export const MAGICONE_BK_NOTES_DATA = {
    "1": "ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示し、「R」レンジ時以外でも「前方映像」の表示が可能になります。",
    "2": "車両によりミラー裏コネクターに化粧カバーが取り付けられている場合がありますが、本製品取り付け時、化粧カバーが使用できなくなる場合があります。",
    "3": "車両によってはナビゲーションに映写されるバック映像にちらつきなどが生じる場合がありますが車両特性によるものでAV-C63の異常ではありません。",
    "4": "デジタルインナーミラー全面に映写されるバック映像とナビゲーションに映写されるバック映像では映し出される範囲が異なりますが異常ではありません。",
    "5": "記載全ての型式で作動確認はできておりません。特殊架装車など、車両仕様によってはAV-C63が装着できない場合があります。",
    "6": "本製品を装着することで自動防眩インナーミラーのバックモニター映像にノイズが見える場合があります。バックモニター映像にノイズが発生している場合は、ナビゲーションに映写した場合にもノイズが見える場合があります。接続するナビゲーションの画面比率によっては、画面の端に帯が入る場合がありますが異常ではありません。",
    "7": "市販デジタルインナーミラーにバックカメラ映像は映りません。また、市販ナビゲーションにRCAのバックカメラ入力がない場合は装着できません。",
    "8": "本製品を装着することでデジタルインナーミラーのバックモニター映像にノイズが見える場合があります。\nバックモニター映像にノイズが発生している場合は、ナビゲーションに映写した場合にもノイズが見える場合があります。\n接続するナビゲーションの画面比率によっては、画面の端に帯が入る場合がありますが異常ではありません。",
    "9": "純正自動防眩インナーミラー（バックモニター内臓）と市販デジタルインナーミラーの併用はできません。",
    "10": "「視界補助パック」付車であっても『デジタルミラーモード』でスマートインナーミラー内に「バックカメラ映像」が表示されない車両は【AV-C48】が適合になります。",
    "11": "スマートインナーミラー内のカメラ映像も同時に表示します。",
    "12": "スマートインナーミラー内のカメラ映像は表示しなくなります。",
    "13": "「マルチビューバックガイドモニターカメラ」「雨滴除去機能付きマルチビューバックガイドモニターカメラ」は適合しません。またカメラのコネクタ形状は一般的な純正カメラと同じです。形状では判別することができないため、必ずディーラー様などの車両販売店でご確認ください。",
    "14": "「雨滴除去機能付きバックカメラ」は動作未確認です。またカメラのコネクタ形状は一般的な純正カメラと同じです。形状では判別することができないため、必ずディーラー様などの車両販売店でご確認ください。",
    "15": "カメラ起動のタイミングにより正常に映写できない場合があります。（ただし、マジコネ「AV-C02」と弊社カメラ製品（AV-FBC01R・AV-FBC02R・AV-FBC03R）の電源をACC接続としてご使用いただく場合のみ使用可能です。）",
    "16": "「AV-C13」は、ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示します。（ご注意：「R」レンジ以外では表示しません。）",
    "17": "「AV-C13FA」は、ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示し、「R」レンジ時以外でも「前方映像」を表示が可能になります。",
    "18": "日産ディーラーオプションナビゲーションに純正カメラ映像を映し出す場合は【マジコネ ニッサン ディーラーオプション適合表】に記載の≪マジコネ バックカメラ“接続ハーネス”≫と併用することで可能になります。",
    "19": "ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示します。（ご注意：「R」レンジ以外では表示しません。）",
    "20": "適合するナビゲーションはマジコネ ディーラーオプション適合 内 「AV-C55」適合機種に限ります。",
    "21": "「AV-C13FC/AV-C13FD」は、ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示し、「R」レンジ時以外でも「前方映像」を表示が可能になります。",
    "22": "カメラスイッチを押し、メーター内にアラウンドビューモニター映像が表示している事を確認してください。アラウンドビューモニター映像が表示していない場合やディーラーオプションナビのみに表示していた場合は、ディーラーにて「CONSULT」による設定変更が必要になります。（作業工賃についてはディーラーへご確認ください。）",
    "23": "カメラ視点固定式：「AV-C05」 / カメラ視点切替式：「AV-C06」のどちらかをご選択下さい。",
    "24": "カメラ視点固定式：「AV-C61」 / カメラ視点切替式：「AV-C62」のどちらかをご選択下さい。",
    "25": "○一部車両で画面下部の映像が乱れて表示されますが、カメラの仕様によるものです。市販ナビゲーション等にマジコネを用いてカメラ映像を表示すると、カメラ映像が暗い、変色する、映らない、といった症状が発生する場合があります。この場合にはマジコネ映像増幅器【AV-AMP01 (1,980 円 税込）】を取り付けて頂く事で症状が改善されます。",
    "26": "三菱純正スマートフォン連携ディスプレイオーディオ（SDA）から市販ナビゲーションへ載せ替えた後も、マルチアラウンドモニター（バードアイビュー機能付）映像をナビゲーション画面に表示させる事ができます。スマートフォン連携ディスプレイオーディオ（SDA）を取り外すことにより、下記の連携する機能は使用できなくなります。\n◆スマートフォン連携ディスプレイオーディオ（SDA）連携ETC/ETC2.0 ◆スマートフォン連携ディスプレイオーディオ（SDA)での車両機能設定\n◆タッチパッドコントローラー ◆リンクシステム ◆ボイスコマンド機能 ◆ステアリングスイッチによる表示「ビュー」の変更 など",
    "27": "カメラコントローラーキット（純正品番/MZ598427）が必要になります。",
    "28": "6.2インチディスプレイオーディオを取り外し、市販ナビゲーションに載せ替え用。スマートパノラマパーキングアシスト機能は使用できなくなります。\n市販ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示し、「R」レンジ時以外でも「前方映像」の表示が可能になります。",
    "29": "カメラコントローラーキット（マツダ品番 ： Z9N1 V6 55Y）が必要になります。",
    "30": "左右確認サポート作動中の通知音はなりません（マーカー表示のみ）",
    "31": "スバルディーラーオプション「用品接続ボックス」が装着されている車両には「AV-C39」は使用しません。「AV-C39」を使用してスバルディーラーオプションリアビューカメラを接続した場合、ガイドライン・ステアリング連動ガイドの表示は行いません。また「用品接続ボックス」を使用するその他ディーラーオプションの装着はできません。",
    "32": "「AV-C35」は、ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示します。（ご注意：「R」レンジ以外では表示しません。）",
    "33": "「AV-C35F」は、ナビゲーションのバックカメラ入力に接続すると「R」レンジ時は「後方映像」を表示し、「R」レンジ時以外でも「前方映像」を表示が可能になります。",
    "34": "【後退時左右確認サポート機能】および【自動俯瞰（ふかん）機能】は使用出来ません。ガイドラインは固定表示となり非表示にする事は出来ません。",
    "35": "カメラコントローラーキット（CA7V：純正品番/99000-79CA1）が必要になります。",
    "36": "トランスミッションが「5AGS」の車両には取り付けできません。",
    "37": "【5極コネクター仕様車】と【RCAピンプラグ仕様車】が混在している可能性がありますので、必ず実車をご確認ください。",
    "38": "カメラ視点の切り替えはできません。",
    "39": "カメラ接続に必要なナビゲーション配線が、オプション設定もしくはナビゲーションユニットに接続されていない場合があります。詳しくはディーラーにおたずねください。",
    "40": "別途、日産純正部品のカメラ接続＆外部入力ハーネス（型番：K6384-C9910）が必要です。K6384-C9910についてはディーラーにご確認下さい。"
};

export const MAGICONE_RM_VTR_NOTES_DATA = {
    "1": "停車時のみ、VTR映像を視聴できます。走行中もVTR映像を視聴したい場合は、当社製品フリーテレビングまたはテレナビングを装着してください。",
    "2": "外部カメラやナビゲーション等の映像はリアモニターには映りません。",
    "3": "走行中はリアモニターにのみテレビ等の映像が映し出されます。フロントモニターにもテレビ等の映像を映したい場合は、当社製品フリーテレビングまたはテレナビングを装着してください。",
    "4": "「AV-V05」は、フリーテレビング機能がないため、走行中は映像視聴ができません。走行中も映像視聴するためには、フリーテレビング機能付の品番（AV-V05T/AV-V05TM）を選択するか、別途フリーテレビングを装着してください。",
    "5": "「AV-V05T」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「オートタイプ」です。",
    "6": "「AV-V05TM」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「スイッチ切替タイプ」です。",
    "7": "「AV-V07」は、フリーテレビング機能がないため、走行中は映像視聴ができません。走行中も映像視聴するためには、フリーテレビング機能付の品番（AV-V07T/AV-V07TM等）を選択するか、別途フリーテレビングを装着してください。",
    "8": "「AV-V07T」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「オートタイプ」です。外部入力映像の切り替え用に「LEDスイッチ」が付属します。",
    "9": "「AV-V07TA/AV-V07TC」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「オートタイプ」です。外部入力映像の切り替え用に「サービスホールスイッチ」が付属します。",
    "10": "「AV-V07TM」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「スイッチ切替タイプ」です。外部入力映像の切り替え用に「LEDスイッチ」が付属します。",
    "11": "「AV-V07TMA/AV-V07TC」は、フリーテレビング機能が搭載されているため、走行中も映像を視聴できます。フリーテレビング機能は「スイッチ切替タイプ」です。外部入力映像の切り替え用に「サービスホールスイッチ」が付属します。",
    "12": "後席9型ワイドディスプレイ付車以外には取り付け出来ません。",
    "13": "停車時のみ、HDMI映像を視聴できます。走行中もHDMI映像を視聴したい場合は、当社製品フリーテレビングまたはテレナビングを装着してください。",
    "14": "「EOP-HZ01TU」は、純正USBパネルをUSB/HDMIパネルに換装する製品です。",
    "15": "ナビゲーション画面・カメラ入力映像・HDMI入力映像及び、USBメモリー・SDカードに保存された映像は出力されません。",
    "16": "「後席ディスプレイ付属ハーネス」「車両純正ハーネス」がデジタル伝送方式の為、AV-R11 は取り付けできません。",
    "17": "後席ディスプレイ（V12T-R66C）用リモコンを使用してナビゲーションを操作することはできません。",
};

export const CAMERA_SELECTOR_NOTES_DATA = {
    "1": "停オーディオユニット裏スペースが少ないため、同一箇所への装着品がある場合は空きスペースの確認を行ってください。（例：マジコネAV-V05/AV-V05T/AV-V05TM・フリーテレビングFFT-229/MS-229/ST-229など）",
    "2": "マジコネAV-C23が既に装着されている場合は、【AV-CS150】をお買い求めください。",
    "3": "マジコネAV-C23Gが既に装着されている場合は、【AV-CS150】をお買い求めください。",
    "4": "マジコネAV-C53が既に装着されている場合は、【AV-CS150】をお買い求めください。",
    "5": "マジコネAV-C53Gが既に装着されている場合は、【AV-CS150】をお買い求めください。",
    "6": "パノラミックビュー付車は取り付けできません。",
    "7": "全車パノラミックビューモニター付車のため取り付けできません。",
};

export const STEERING_SWT_CTRL_NOTES_DATA = {
    "1": "停オーディオユニット裏スペースが少ないため、同一箇所への装着品がある場合は空きスペースの確認を行ってください。（例：マジコネAV-V05/AV-V05T/AV-V05TM・フリーテレビングFFT-229/MS-229/ST-229など）"
};