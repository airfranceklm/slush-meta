import angular from "angular";

/**
 * This can take an array of hateoas links and extract the link matching the testedValue.
 * For example it's used in the user-list.html page to filter the picture url from the Hateoas links.
 */
export default class PictureFilter{
    constructor(){

    }

    static factory(){
        /**
         * Filters the rel attribute of hateoas links against the tested value.
         * @param inputs the array to filter
         * @param testedValue the value to filter against
         * @returns {Array} the array with the filtered values
         */
        return function (inputs, testedValue) {
            var NewArray = [];
            angular.forEach(inputs, function (TabRefElement) {
                if (TabRefElement.rel === testedValue) {
                    NewArray.push(TabRefElement);
                }
            });
            return NewArray;
        };
    }
}
