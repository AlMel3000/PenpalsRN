import {
    Alert,
    AsyncStorage,
    BackHandler,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    VirtualizedList,
} from 'react-native';

import React, {Component} from 'react';

import CardView from 'react-native-cardview'

import Modal from 'react-native-modal'

import {NavigationActions} from 'react-navigation';

import Orientation from 'react-native-orientation-locker';

import RotatingView from './../assets/RotatingView';

import Icon2 from 'react-native-vector-icons/FontAwesome';

import RadioButton from 'radio-button-react-native';

import {Dropdown} from 'react-native-material-dropdown';

import LocalizedStrings from 'react-native-localization';

var TimerMixin = require('react-timer-mixin');

let countriesData = require('./../assets/countries.json');


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];
let stampRotationArray = [];
let sealRotationArray = [];

let viewStampRotationArray = [];

let viewsById = {};

let isAppRatedOrRateDeclined = false;

const BLOCKS_RANGE_FOR_RANDOMIZATION = 100;
const ENVELOPES_AMOUNT_PER_BLOCK = 50;
const CARDS_COUNT_FOR_RATING_DIALOG = 35;

let savedBlock;
let blocksAvailable;

let scrollToFirst = false;

let page = 0;
let block = 1;

let countryByISO = {};

let countByIso = {};

let envelopesByCountry = [];

let strings = new LocalizedStrings({
    "en-US": {
        send_letter: "SEND LETTER",
        create_envelope: 'CREATE ENVELOPE',
        delete_envelope: 'DELETE OWN CARD',
        filter: 'FILTER',
        apply_filter: 'Apply',
        back: 'Back',
        cancel: 'Cancel',
        delete_dialog_body: 'It will not be possible to recover the envelope, even if it was paid for.',
        delete_dialog_title: 'Delete the envelope?',
        do_not_ask: 'Don\'t ask more',
        google_play: 'asdf on Google Play',
        later: 'Later',
        no_own_envelopes: 'You haven\'t added envelopes yet',
        number_of_views: 'NUMBER OF VIEWS',
        own_envelopes_not_found_title: 'Your envelopes are not found',
        own_envelopes_not_found_body: 'Perhaps you have deleted your envelopes or their placement time is expired',
        rating_dialog: 'We really care about your experience and want to make app better for you.\n' +
        'Let us know how it can be improved and we\'ll build it!\n' +
        'Or just rate us on Google Play.',
        reset_filter: 'Reset filter',
        show_only_own_envelopes: 'Show only own envelopes',
        suggest_improvement: 'Improve',
        choose_country: 'Country',
        went_wrong: 'Something went wrong.\n\n Please check your Internet connection or try again later',
        write_us: 'For any questions, write to:',
        email_header: 'Hello, \n\n\n' +
        'Please do not change the subject of the email. \n\n\n' +
        'We, like everyone else, very much love Google Translate:) \n\n' +
        'And like everyone else, know, how to use it.\n\n' +
        'Please, note, meanwhile, that employees of our support team speak English.\n\n\n' +
        'Best Regards, Your Penpals.\n\n---------------------------------------------------------------',
        yes: 'Yes'
    },
    en: {
        send_letter: "SEND LETTER",
        create_envelope: 'CREATE ENVELOPE',
        delete_envelope: 'DELETE OWN CARD',
        filter: 'FILTER',
        apply_filter: 'Apply',
        back: 'Back',
        cancel: 'Cancel',
        delete_dialog_body: 'It will not be possible to recover the envelope, even if it was paid for.',
        delete_dialog_title: 'Delete the envelope?',
        do_not_ask: 'Don\'t ask more',
        google_play: 'Penpal on Google Play',
        later: 'Later',
        no_own_envelopes: 'You haven\'t added envelopes yet',
        number_of_views: 'NUMBER OF VIEWS',
        own_envelopes_not_found_title: 'Your envelopes are not found',
        own_envelopes_not_found_body: 'Perhaps you have deleted your envelopes or their placement time is expired',
        rating_dialog: 'We really care about your experience and want to make app better for you.\n' +
        'Let us know how it can be improved and we\'ll build it!\n' +
        'Or just rate us on Google Play.',
        reset_filter: 'Reset filter',
        show_only_own_envelopes: 'Show only own envelopes',
        suggest_improvement: 'Improve',
        choose_country: 'Country',
        went_wrong: 'Something went wrong.\n\n Please check your Internet connection or try again later',
        write_us: 'For any questions, write to:',
        email_header: 'Hello, \n\n\n' +
        'Please do not change the subject of the email. \n\n\n' +
        'We, like everyone else, very much love Google Translate:) \n\n' +
        'And like everyone else, know, how to use it.\n\n' +
        'Please, note, meanwhile, that employees of our support team speak English.\n\n\n' +
        'Best Regards, Your Penpals.\n\n---------------------------------------------------------------',
        yes: 'Yes'
    },
    ja: {
        send_letter: '手紙を送ります',
        create_envelope: '封筒を作成します。',
        delete_envelope: '自分の封筒を消去',
        filter: 'フィルタ',
        apply_filter: '適用します',
        back: '戻る',
        cancel: 'キャンセル',
        delete_dialog_body: '例え支払われたとしても、封筒を復元することは不可能です。',
        delete_dialog_title: '封筒を消去しますか?',
        do_not_ask: 'それ以上聞かないでください',
        google_play: 'Google Play の Penpals',
        later: '後',
        no_own_envelopes: 'あなたはまだ封筒を追加していません',
        number_of_views: '閲覧数',
        own_envelopes_not_found_title: 'あなたの封筒は見つかりません。',
        own_envelopes_not_found_body: '恐らく自分の封筒を削除してしまったか、掲載期限切れになったようです。',
        rating_dialog: 'あなたの経験に気を配り、あなたのためにアプリケーションをより良くしたいと思っています。\n' +
        'どのように改善されるべきか教えてください、私たちはそれをもとに構築していきます\n' +
        'または、Google Play で評価してください。',
        reset_filter: 'フィルターをリセット',
        show_only_own_envelopes: '自分の封筒のみ表示',
        suggest_improvement: '改善',
        choose_country: '国',
        went_wrong: '何か問題があったようです。\n\nインターネットの接続を確認するか、後でもう一度お試しください。',
        write_us: '何か質問があれば書いてください。',
        email_header: 'こんにちは, \n\n\n' +
        'Eメールのタイトルは変更しないでください。 \n\n\n' +
        '私たちは皆さんと同じくグーグル翻訳がとても好きです(^^)\n\n' +
        'そして、皆さんと同じようにその使い方を知っています。\n\n' +
        'サポートチームのスタッフは英語を話すことをご承知おきください。\n\n\n' +
        'よろしくお願いします。 Your Penpals.\n\n---------------------------------------------------------------',
        yes: 'はい'
    },
    ru: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'

    },
    be: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'


    },
    uk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'

    },
    az: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'


    },
    hy: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'

    },
    kk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'


    },
    ky: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'

    },
    tg: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'


    },
    tk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'

    },
    uz: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР',
        apply_filter: 'Применить',
        back: 'Назад',
        cancel: 'Отмена',
        delete_dialog_body: 'Восстановить конверт будет невозможно, даже если он был оплачен.',
        delete_dialog_title: 'Удалить конверт?',
        do_not_ask: 'Не спрашивать',
        google_play: 'Penpal на Google Play',
        later: 'Позже',
        no_own_envelopes: 'Вы ещё не добавляли конверты',
        number_of_views: 'ПРОСМОТРЫ',
        own_envelopes_not_found_title: 'Ваши конверты не найдены',
        own_envelopes_not_found_body: 'Возможно Вы удалили свои конверты или истёк срок их размещения',
        rating_dialog: 'Мы ценим Ваш опыт и хотим сделать приложение удобнее.\nПожалуйста, сообщите нам, как его можно улучшить и мы будем действовать!\nИли просто поставьте нам оценку в Google Play!',
        reset_filter: 'Сбросить',
        show_only_own_envelopes: 'Показать только собственные конверты',
        suggest_improvement: 'Улучшить',
        choose_country: 'Страна',
        went_wrong: 'Что-то пошло не так.\n\nПожалуйста, проверьте интернет соединение или зайдите позже',
        write_us: 'По любым вопросам пишите нам:',
        email_header: 'Здравствуйте!\n\n' +
        'Пожалуйста не изменяйте тему письма.\n\n' +
        'Мы как и все очень любим Google Translate :)\n\n' +
        'И как и все умеем им пользоваться.\n\n' +
        'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n\n' +
        'С наилучшими пожеланиями, Ваш Penpals.\n\n' +
        '---------------------------------------------------------------',
        yes: 'Да'


    }

});


export default class Main extends Component {

    static navigationOptions = {
        header: false
    };

    onRefresh = () => {
        this.setState({
            showProgress: true,
            showError: false
        });
        this.saveStatus()
            .then(this.getUserStatus())
            .catch((e) => console.log.e)
    };

    z;

    constructor(props) {
        super(props);


        this.state = {
            showProgress: true,
            showError: false,
            refreshing: false,
            showButton: false,
            showMenu: false,
            showRateDialog: false,
            showFilter: false,

            pagesViewed: 0,

            value: 0,

            ownEnvelopesFilterText: strings.show_only_own_envelopes,
            ownEnvelopesFilterTextColor: '#212121',

            showOwnEnvelopes: false,
            userEmails: ''
        };


        this.renderEnvelope = this.renderEnvelope.bind(this);
        this._onScrollEnd = this._onScrollEnd.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
        this.showButton = this.showButton.bind(this);
    }

    componentDidMount() {
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
            return true;
        });
        this.getCountries();
    }

    componentWillUnmount() {
        this.saveStatus();
        this.updateViews();
    }

    componentWillMount() {
        if (this.props.navigation.state.params !== undefined) {
            envelopesArray = this.props.navigation.state.params.envelopesArray;
            block = this.props.navigation.state.params.block;
            page = this.props.navigation.state.params.page;
            this.setState({
                showProgress: false
            })
        } else {
            this.getUserStatus();
        }

        this.getRateAndEmailsInfo();
    }

    async getUserStatus() {
        try {
            this.setState({
                showProgress: true,
                showError: false,
                showMenu: false,
                showButton: false,
                showFilter: false,
                value: 0,
                code: '',
                showOwnEnvelopes: false
            });
            savedBlock = JSON.parse(await AsyncStorage.getItem('block'));


            let lastCardOfUser = JSON.parse(await AsyncStorage.getItem('lastCardOfUser'));

            if (await savedBlock !== null) {
                block = savedBlock;
                if (!scrollToFirst) {
                    page = JSON.parse(await AsyncStorage.getItem('page'));
                }
                if (await lastCardOfUser) {
                    this.getLastCardOfUser(lastCardOfUser);
                } else {
                    this.getCards();
                }
            } else {
                block = this.randomizer(BLOCKS_RANGE_FOR_RANDOMIZATION);
                await this.getCards();
            }


        } catch (message) {
            this.getCards();
        }

    }

    async getLastCardOfUser(email: string) {
        try {
            let response = await fetch(('http://penpal.eken.live/Api/get-last-user-envelope/?email=' + email), {
                method: 'GET'
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {

                if (!res.result) {
                    let tempArray = [{
                        type: "card",
                        data: {
                            id: res.id,
                            first_name: res.first_name,
                            address: res.address,
                            city: res.city,
                            country_name: res.country_name,
                            postal: res.postal,
                            email: res.email,
                            description: res.description,
                            photo: res.image_id,
                            envelope: res.envelope, stamp: res.stamp, seal: res.seal,
                            views: res.views
                        },
                        resources: {envelope: res.envelope, stamp: res.stamp, seal: res.seal}
                    }];
                    tempArray.concat(envelopesArray);
                    envelopesArray = tempArray;
                }

            }
        } catch (message) {
        } finally {
            this.getCards();
        }
    }

    async saveStatus() {
        try {
            await AsyncStorage.setItem('block', JSON.stringify(block));
            await AsyncStorage.setItem('page', JSON.stringify(page));
            await AsyncStorage.setItem('pagesViewed', JSON.stringify(this.state.pagesViewed));
        } catch (error) {
        }
    }

    async getCards() {
        try {
            this.setState({
                showProgress: true
            });
            const data = new FormData();
            data.append('country', this.state.code);
            data.append('page', block);
            data.append('perPage', ENVELOPES_AMOUNT_PER_BLOCK);


            let response = await fetch(('http://penpal.eken.live/api/get-cards'), {
                method: 'POST',
                body: data
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {
                blocksAvailable = res.pages;
                let envelopesReceived = res.cards;

                // if any user doesn't exceed blocks range - let my user go
                if (block <= blocksAvailable) {
                    // if user exceeds page range (due to card deletion) - get him to 1st page of first block
                    if (this.state.page >= envelopesReceived.length) {
                        page = 0;
                        block = 1;
                    }
                    envelopesArray = envelopesArray.concat(envelopesReceived);
                } else {
                    // if not new user exceeds blocks range (due to card deletion) - get him to 1st page of 1st block
                    if (savedBlock !== null) {
                        page = 0;
                        block = 1;
                        envelopesArray = envelopesArray.concat(envelopesReceived);
                        // if new user exceeds blocks range - randomize him again
                    } else {
                        block = this.randomizer(blocksAvailable);
                        this.getCards();
                        return;
                    }

                }

                this.setState({
                    showProgress: false,
                    showError: false
                });
            } else {
                this.setState({
                    showProgress: false,
                    showError: true
                });
            }
        } catch (message) {
            this.setState({
                showProgress: false,
                showError: true
            });
        }
    }


    async getCountries() {
        try {
            let response = await fetch(('http://penpal.eken.live/api/get-cards?page=' + block + '&perPage=' + ENVELOPES_AMOUNT_PER_BLOCK), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {

                countByIso = res.countries;
                let countryCodesFromServer = Object.keys(countByIso);
                for (let i = 0; i < countryCodesFromServer.length; i++) {
                    let code = countryCodesFromServer[i];
                    let countryname = '';
                    countriesData.filter(value => value.cca2 === code)
                        .map(value => countryname = value.name.common);

                    countryByISO[code] = countryname;

                    envelopesByCountry.push({value: countryname + ' (' + countByIso[code] + ")"})
                }
            }
        } catch (message) {
            this.setState({
                showProgress: false,
                showError: true
            });
        }
    }

    randomizer(max: number) {
        let rand = (Math.random() * max);
        let randomBlock = Math.floor(rand) + 1;
        return randomBlock;
    }

    async getRateAndEmailsInfo() {
        if (JSON.parse(await AsyncStorage.getItem('isAppRatedOrRateDeclined'))) {
            isAppRatedOrRateDeclined = true;
        } else {
            let storedPagesViewed = JSON.parse(await AsyncStorage.getItem('pagesViewed'));
            storedPagesViewed === null ? this.setState({pagesViewed: 0}) : this.setState({pagesViewed: storedPagesViewed});
        }
        this.setState({
            userEmails: JSON.parse(await AsyncStorage.getItem('userEmails'))
        });

    }

    showButton() {

        TimerMixin.requestAnimationFrame(() => {
            if (!this.state.showButton) {
                this.setState({
                    showButton: true
                })
            } else {
                this.setState({
                    showButton: false
                })
            }
            this.setState({
                showMenu: false
            })
        })

    }

    onScroll(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        page = Math.floor(contentOffset.x / viewSize.width);

        this.incrementViews(page);
        this.setState({
            showButton: false
        });

        if (!isAppRatedOrRateDeclined) {
            this.setState({pagesViewed: this.state.pagesViewed + 1});
            if (this.state.pagesViewed >= CARDS_COUNT_FOR_RATING_DIALOG) {
                this.setState({
                    pagesViewed: 0,
                    showRateDialog: true
                })
            }
        }
    }

    async deleteOwnEnvelope(id: number) {
        try {
            this.setState({
                showButton: false,
                showMenu: false
            });
            let response = await fetch(('http://penpal.eken.live/Api/delete/?id=' + id), {
                method: 'GET'
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {

                if (res.result === 0) {
                    this.setState({
                        showProgress: true,
                    });
                    envelopesArray = [];
                    if (page > 0) {
                        page--;
                    }
                    if (!this.state.showOwnEnvelopes) {
                        this.getCards();
                    } else {
                        this.getAllCardsOfUser();
                    }
                }


            }
        } catch (message) {
        }
    }

    showDeletionWarning(id: number) {
        Alert.alert(
            strings.delete_dialog_title,
            strings.delete_dialog_body,
            [
                {text: strings.yes, onPress: () => this.deleteOwnEnvelope(id)},
                {text: strings.cancel},
            ],
            {cancelable: true}
        )
    }

    renderEnvelope(envelope) {

        let buttonIconColor = '#9e9e9e';
        let buttonTextColor = '#9e9e9e';
        let isButtonDisabled = true;
        if (this.state.userEmails !== null && this.state.userEmails.includes(envelope.item.data.email)) {
            buttonIconColor = 'red';
            buttonTextColor = 'red';
            isButtonDisabled = false;
        } else {
            buttonIconColor = '#9e9e9e';
            buttonTextColor = '#9e9e9e';
            isButtonDisabled = true;
        }
        let imageURL;
        if (envelope.item.data.photo < 0) {
            imageURL = 'https://robohash.org/' + envelope.item.data.first_name;
        } else {
            imageURL = 'http://penpal.eken.live/Api/photo/width/300/id/' + envelope.item.data.photo;
        }
        let envelopeNumber = envelope.item.data.envelope;
        let envelopeURL;
        if (envelopeNumber < 10) {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=00' + envelopeNumber;
        } else if (envelopeNumber > 9 && envelopeNumber < 100) {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=0' + envelopeNumber;
        } else {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=' + envelopeNumber;
        }

        let stampNumber = envelope.item.data.stamp;
        let stampURL;
        if (stampNumber < 10) {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=00' + stampNumber;
        } else if (stampNumber > 9 && stampNumber < 100) {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=0' + stampNumber;
        } else {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=' + stampNumber;
        }

        let sealNumber = envelope.item.data.seal;
        let sealURL;
        if (sealNumber < 10) {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=00' + sealNumber;
        } else if (sealNumber > 9 && sealNumber < 100) {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=0' + sealNumber;
        } else {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=' + sealNumber;
        }

        let stampRotation;
        let sealRotation;
        let viewStampRotation;

        let id = envelope.item.data.id;

        if (stampRotationArray.hasOwnProperty(id)) {
            stampRotation = stampRotationArray[id];
        } else {
            stampRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            stampRotationArray[id] = stampRotation;
        }


        if (id in sealRotationArray) {
            sealRotation = sealRotationArray[id];
        } else {
            sealRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            sealRotationArray[id] = sealRotation;
        }

        if (id in viewStampRotationArray) {
            viewStampRotation = viewStampRotationArray[id];
        } else {
            viewStampRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            viewStampRotationArray[id] = viewStampRotation;
        }


        return (
            <TouchableOpacity style={styles.viewPager} key={envelope.item.data.id}
                              activeOpacity={1}
                              onPress={(e) => this.showButton()}>
                <Image source={{uri: envelopeURL}} style={styles.envelopeImage}>
                    <View style={styles.topRow}>
                        <View style={styles.topLeftRow}>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row',}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.name}>
                                    {envelope.item.data.first_name}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.address}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.city}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.country_name + ', ' + envelope.item.data.postal}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.topRightRow}>
                            <Image source={{uri: imageURL}} style={styles.userPhoto}/>
                            <Image source={{uri: stampURL}} style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 4,
                                resizeMode: 'contain',
                                transform: [{rotate: stampRotation}],
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute'
                            }}/>
                            <Image source={{uri: sealURL}} style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 5,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute',
                                transform: [{rotate: sealRotation}]
                            }}/>
                        </View>

                        <View style={{
                            height: 38,
                            width: 74,
                            borderColor: 'black',
                            borderWidth: 1.5,
                            position: 'absolute',
                            right: deviceWidth / 20,
                            alignSelf: 'flex-end',
                            transform: [{rotate: viewStampRotation}]
                        }}>
                            <View style={{
                                height: 18,
                                width: 60,
                                borderColor: 'black',
                                borderWidth: 1,
                                position: 'absolute',
                                alignSelf: 'center',
                                marginTop: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'center'
                                }}>{envelope.item.data.views}</Text>
                            </View>
                            <Text style={{
                                color: 'black',
                                fontSize: 8,
                                alignSelf: 'center'
                            }}>{strings.number_of_views}</Text>

                        </View>

                    </View>
                    <View
                        style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                        <View style={{flex: 1, width: deviceWidth / 2.6}}/>
                        <View style={{
                            flex: 1,
                            width: deviceWidth / 1.6,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            paddingBottom: deviceHeight * 0.1
                        }}>
                            <Image source={require('./../assets/quote.png')}
                                   style={{height: deviceHeight / 25, resizeMode: 'contain', marginTop: 25}}/>
                            <Text style={{
                                color: '#212121',
                                fontSize: 14,
                                marginLeft: deviceWidth * 0.003125,
                                width: deviceWidth / 2 - 64,
                                marginTop: 25
                            }}>
                                {envelope.item.data.description}
                            </Text>
                        </View>
                    </View>
                    {this.state.showButton &&
                    <View style={{
                        position: 'absolute',
                        bottom: 32,
                        right: 32,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flex: 0
                    }}>
                        {this.state.showMenu &&
                        <CardView style={{
                            marginBottom: deviceHeight * 0.011,
                            paddingVertical: deviceHeight * 0.022222,
                            paddingHorizontal: deviceWidth * 0.025
                        }}
                                  cardElevation={2}
                                  cardMaxElevation={2}
                                  cornerRadius={2}>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this._navigateTo('LetterDeparture', {
                                                  envelopesArray: envelopesArray,
                                                  block: block,
                                                  page: page,
                                                  recipientData: envelope.item.data
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.send_letter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="send-o" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this._navigateTo('EnvelopeFillingScreen', {
                                                  envelopesArray: envelopesArray,
                                                  block: block,
                                                  page: page
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.create_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="envelope-o" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              disabled={isButtonDisabled}
                                              onPress={(e) => this.showDeletionWarning(envelope.item.data.id)}>
                                <Text style={{
                                    color: buttonTextColor,
                                    fontSize: 16,
                                    marginRight: deviceWidth * 0.03125
                                }}>{strings.delete_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="trash-o" style={{fontSize: 22, color: buttonIconColor}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this.setState({
                                                  showFilter: true,
                                                  showMenu: false,
                                                  showButton: false
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.filter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="filter" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                        </CardView>}
                        <TouchableOpacity style={{
                            backgroundColor: '#ff4444',
                            borderRadius: 64,
                            height: deviceHeight * 0.155,
                            width: deviceHeight * 0.155
                        }}
                                          activeOpacity={1}
                                          onPress={(e) => this.onClickFab()}/>
                    </View>}
                    <Modal isVisible={this.state.showRateDialog}
                           backdropOpacity={0.5}>
                        <View style={{flex: 0, marginHorizontal: 56, backgroundColor: 'white', padding: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={require('./../assets/google_play_icon.png')}
                                       style={{resizeMode: 'contain', height: 32, width: 32}}/>
                                <Text
                                    style={{fontSize: 18, color: '#257492', marginLeft: 8}}>{strings.google_play}</Text>
                            </View>
                            <Text style={{
                                color: '#212121',
                                fontSize: 16,
                                marginTop: 8
                            }}>
                                {strings.rating_dialog}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 24,
                                marginBottom: 8
                            }}>
                                <TouchableOpacity
                                    style={{flex: 3, justifyContent: 'center', alignItems: 'flex-start'}}
                                    onPress={(e) => this.annihilateFutureRateDialogues()}><Text
                                    style={{
                                        color: '#257492',
                                        fontSize: 16
                                    }}>{strings.do_not_ask}</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.setState({showRateDialog: false})}><Text
                                    style={{color: '#257492', fontSize: 16}}>{strings.later}</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.rate()}><Text
                                    style={{
                                        color: '#257492',
                                        fontSize: 16
                                    }}>{strings.suggest_improvement}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.showFilter}
                           backdropOpacity={0.4}>
                        <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
                            <Text style={{
                                flex: 2,
                                alignSelf: 'center',
                                fontSize: 18,
                                color: '#212121'
                            }}>{strings.filter}</Text>
                            <View style={{
                                flex: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <RadioButton style={{alignSelf: 'flex-end'}}
                                             currentValue={this.state.value} value={1}
                                             onPress={this.handleOnPress.bind(this)} outerCircleColor={'dodgerblue'}/>
                                <View style={{width: 22, marginLeft: 16, alignSelf: 'center'}}>
                                    <Icon2 name="globe" style={{fontSize: 20, color: 'black'}}/>
                                </View>
                                <View style={{
                                    flex: 1, marginHorizontal: 8, justifyContent: 'flex-start', alignSelf: 'flex-start'
                                }}>
                                    <Dropdown
                                        label={strings.choose_country}
                                        data={envelopesByCountry}
                                        onChangeText={(data) => this.handleCountrySelection(data)}/>
                                </View>
                            </View>
                            <View style={{
                                flex: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <RadioButton currentValue={this.state.value} value={2}
                                             onPress={this.handleOnPress.bind(this)} outerCircleColor={'dodgerblue'}/>
                                <Text style={{
                                    marginLeft: 16,
                                    color: this.state.ownEnvelopesFilterTextColor,
                                    fontSize: 16
                                }}>{this.state.ownEnvelopesFilterText}</Text>
                            </View>
                            <View style={{
                                flex: 3,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <TouchableOpacity
                                    style={{flex: 1.5, justifyContent: 'center', alignItems: 'flex-start'}}
                                    onPress={(e) => this.setState({showFilter: false, value: 0})}><Text
                                    style={{color: '#257492', fontSize: 16}}>{strings.back}</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 8}}
                                    onPress={(e) => this.resetFilter()}><Text
                                    style={{
                                        color: '#257492',
                                        fontSize: 16
                                    }}>{strings.reset_filter}</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.handleFilter()}>
                                    <Text
                                        style={{
                                            color: '#257492',
                                            fontSize: 16
                                        }}>{strings.apply_filter}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </Image>
            </TouchableOpacity>
        );
    }


    _onScrollEnd() {
        if (envelopesArray.length > 14 && !this.state.showOwnEnvelopes) {
            this.setState({
                showProgress: true
            });
            let nextBlock;
            if (block < blocksAvailable) {
                nextBlock = block++;

            } else {
                nextBlock = 1;
            }
            block = nextBlock;
            this.getCards();
            this.updateViews();
        }
    }

    onClickFab() {
        TimerMixin.requestAnimationFrame(() => {
            if (!this.state.showMenu) {
                this.setState({
                    showMenu: true
                })
            } else {
                this.setState({
                    showMenu: false
                })
            }
        })
    }

    incrementViews(pageNum: number) {
        let id = envelopesArray[pageNum].data.id;

        let email = envelopesArray[pageNum].data.email;

        let viewsToShow = envelopesArray[pageNum].data.views;

        let view = 0;
        if (!this.state.userEmails || this.state.userEmails.indexOf(email) < 1) {
            if (id in viewsById) {
                view = viewsById[id];
            }
            view++;
            viewsToShow++;
            envelopesArray[pageNum].data.views = viewsToShow;
            viewsById[id] = view;
        }

    }

    async updateViews() {
        try {
            if (Object.keys(viewsById).length > 0) {
                let data = new FormData();
                for (let id in viewsById) {
                    data.append(id, viewsById[id])
                }
                let response = await fetch('http://penpal.eken.live/Api/update-views', {
                    method: 'POST',
                    body: data
                });
                let res = JSON.stringify(await response.text());
            }
        } catch (message) {
        }
    }

    async annihilateFutureRateDialogues() {
        isAppRatedOrRateDeclined = true;
        this.setState({showRateDialog: false});
        try {
            await AsyncStorage.setItem('isAppRatedOrRateDeclined', JSON.stringify(true));
        } catch (error) {
        }
    }

    rate() {
        this.annihilateFutureRateDialogues();

        //todo rate for iOS

        let uri = "market://details?id=live.eken.penpal";
        Linking.canOpenURL(uri).then(supported => {
            if (!supported) {
                return Linking.openURL('https://play.google.com/store/apps/details?id=live.eken.penpal');
            } else {
                return Linking.openURL(uri);
            }
        }).catch(err => console.error('An error occurred', err));

    }

    handleOnPress(value) {
        this.setState({value: value});
        if (value === 2) {
            if (this.state.userEmails === null || this.state.userEmails.length === 0) {
                this.setState({
                    ownEnvelopesFilterText: strings.no_own_envelopes,
                    ownEnvelopesFilterTextColor: 'red'
                })
            } else {
                this.setState({
                    ownEnvelopesFilterText: strings.show_only_own_envelopes,
                    ownEnvelopesFilterTextColor: '#212121'
                })
            }
        }
    }

    handleCountrySelection(country: string) {
        let countryName = country.split(' (')[0];
        const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);
        let code = getKey(countryByISO, countryName);
        this.setState({
            code: '"' + code + '"',
            value: 1
        })

    }

    handleFilter() {
        this.saveStatus();
        if (this.state.value === 1) {
            if (!this.state.code.isEmpty) {
                envelopesArray = [];
                block = 1;
                page = 0;
                this.getCards();
                this.setState({
                    showFilter: false,

                });
            }

        } else if (this.state.value === 2) {
            if (this.state.userEmails !== null && this.state.userEmails.length > 0) {
                envelopesArray = [];
                block = 1;
                page = 0;
                this.getAllCardsOfUser();
                this.setState({
                    showFilter: false,
                    showOwnEnvelopes: true
                });
            }
        }
    }


    async getAllCardsOfUser() {
        try {

            this.setState({
                showProgress: true
            });
            const data = new FormData();
            for (let i = 0; i < this.state.userEmails.split(',').length; i++) {
                data.append('emails[]', this.state.userEmails.split(',')[i]);
            }


            let response = await fetch(('http://penpal.eken.live/Api/get-cards-by-email'), {
                method: 'POST',
                body: data
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {
                if (res.length === 0) {
                    this.setState({
                        showOwnEnvelopes: false
                    });
                    this.showUserDeletedDialog();
                }
                for (let i = 0; i < res.length; i++) {
                    let tempArray = {
                        type: "card",
                        data: {
                            id: res[i].id,
                            first_name: res[i].first_name,
                            address: res[i].address,
                            city: res[i].city,
                            country_name: res[i].country_name,
                            postal: res[i].postal,
                            email: res[i].email,
                            description: res[i].description,
                            photo: res[i].image_id,
                            envelope: res[i].envelope, stamp: res[i].stamp, seal: res[i].seal,
                            views: res[i].views
                        },
                        resources: {envelope: res[i].envelope, stamp: res[i].stamp, seal: res[i].seal}
                    };

                    envelopesArray.push(tempArray)

                }

                this.setState({
                    showProgress: false,
                    showError: false
                });
            } else {
                this.setState({
                    showProgress: false,
                    showError: true,
                    showOwnEnvelopes: false
                });
            }
        } catch (message) {
            this.setState({
                showProgress: false,
                showError: true,
                showOwnEnvelopes: false
            });
        }
    }


    resetFilter() {
        envelopesArray = [];
        this.setState({
                code: ' ',
                showOwnEnvelopes: false
            }
        );
        this.getUserStatus()
    }

    showUserDeletedDialog() {
        Alert.alert(
            strings.own_envelopes_not_found_title,
            strings.own_envelopes_not_found_body,
            [
                {text: 'Ok', onPress: () => this.getUserStatus()},
            ],
            {cancelable: false}
        )
    }

    _navigateTo = (routeName, params) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName, params})]
        });
        this.props.navigation.dispatch(resetAction)
    };


    render() {
        return (
            <View style={styles.container}>
                {this.state.showProgress &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight,
                    alignSelf: "stretch",
                    resizeMode: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <RotatingView
                        style={{height: 48, width: 48, alignSelf: 'center'}}
                        duration={3000}
                        onFinishedAnimating={( (status) => {
                        } )}>
                        <Image
                            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                            resizeMode='contain'
                            source={require("./../assets/enveolopes_loading_48_px.png")}/>
                    </RotatingView>
                </Image>}
                {this.state.showError &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight,
                    alignSelf: "stretch",
                    resizeMode: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        alignSelf: 'center',
                        width: deviceWidth - 64,
                        margin: 64,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <Text
                            style={{color: '#212121', flex: 1, fontSize: 16,}}>
                            {strings.went_wrong}
                        </Text>
                        <TouchableOpacity style={{
                            flex: 1,
                            alignSelf: 'center',
                            padding: 2,
                            margin: 8
                        }}
                                          onPress={(e) => this.getUserStatus()}>
                            <Image source={require('./../assets/refresh_blue.png')}
                                   style={{flex: 1}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}
                            onPress={(e) => Linking.openURL('mailto:119@penpal.eken.live?subject=From Penpals app&body=' + strings.email_header)}>
                            <Text
                                style={{
                                    flex: 3,
                                    alignSelf: 'center',
                                    color: '#212121',
                                    width: deviceWidth,
                                    fontSize: 16
                                }}>
                                {strings.write_us}
                            </Text>
                            <Text
                                style={{
                                    flex: 2,
                                    alignSelf: 'center',
                                    color: '#1ca9c9',
                                    width: deviceWidth,
                                    fontSize: 16
                                }}>
                                {'119@penpal.eken.live'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Image>}
                {!( this.state.showProgress || this.state.showError) &&
                <VirtualizedList
                    horizontal
                    pagingEnabled
                    initialNumToRender={1}
                    getItemCount={data => data.length}
                    data={envelopesArray}
                    initialScrollIndex={page}
                    keyExtractor={(item, index) => item.data.id}
                    getItemLayout={(data, index) => ({
                        length: deviceWidth,
                        offset: deviceWidth * index,
                        index
                    })}
                    maxToRenderPerBatch={1}
                    windowSize={1}
                    getItem={(data, index) => ( data[index])}
                    renderItem={this.renderEnvelope}
                    onEndReached={this._onScrollEnd}
                    onEndReachedThreshold={1}
                    onStartReached={this._onScrollEnd}
                    onStartThreshold={1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    removeClippedSubviews={false}
                    onMomentumScrollEnd={this.onScroll}
                />
                }
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e4e4',
    },
    viewPager: {
        flex: 1,
        width: null, height: null,
        alignSelf: 'center',
        paddingVertical: deviceHeight * 0.025,

    },
    page: {
        flex: 1,
    },
    topRow: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    envelopeImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
    topLeftRow: {
        height: deviceHeight / 1.9,
        width: deviceWidth / 2 - 82,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingLeft: deviceWidth * 0.0225,
        paddingTop: deviceHeight * 0.15
    },
    prefix: {
        height: deviceHeight / 25,
        resizeMode: 'contain'
    },
    topRightRow: {
        height: deviceHeight / 1.9,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: deviceWidth * 0.0375,
        paddingTop: deviceHeight * 0.1125
    },
    userPhoto: {
        height: deviceHeight / 2.5,
        width: deviceWidth / 4,
        resizeMode: 'contain',
        marginTop: deviceHeight * 0.025
    },
    address: {
        color: '#212121',
        fontSize: 14,
        marginLeft: deviceWidth * 0.003125
    },
    name: {
        color: '#212121',
        fontSize: 16,
        marginLeft: deviceWidth * 0.003125
    },
    actionButtonIcon: {
        fontSize: 22,
        color: '#757575',
    },
    actionButtonText: {
        color: '#212121',
        fontSize: 16,
        marginRight: deviceWidth * 0.03125
    }
});

