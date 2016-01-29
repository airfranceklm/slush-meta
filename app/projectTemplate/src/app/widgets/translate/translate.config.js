/**
 * TranslateConfig
 * The initialisation class for the translations.
 */
export default class TranslateConfig {

    constructor() {


    }

    /**
     * static initialization.
     */
    static init($translateProvider, $localeProvider, $windowProvider, languageServiceProvider){
        "ngInject";

        //don't remove this tag this will automatically be updated when building the app.
        /* LANGUAGES_PARAMS */
        let languages = ["en"];
        /* LANGUAGES_PARAMS-END */

        $translateProvider.useSanitizeValueStrategy("escape");

        $translateProvider.useStaticFilesLoader({
            prefix: "languages/app.",
            suffix: ".json"
        });

        let avLang = {};
        for (let l of languages){
            avLang[`${l}*`] = l;
        }

        $translateProvider.registerAvailableLanguageKeys(languages, avLang)
            .determinePreferredLanguage();

        $translateProvider.fallbackLanguage(languages[0]);

        languageServiceProvider.$get().languages = languages;

    }



}
