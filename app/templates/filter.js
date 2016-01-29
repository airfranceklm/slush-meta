import angular from "angular";

/**
 * <%= _.capitalize(filterName) %>Filter
 * <%= filterDescription %>
 */
export default class <%= _.capitalize(filterName) %>Filter {

    constructor() {

    }

    static factory(){
        /**
         * This function should contain your filter code and do the actual filtering.
         * @param inputs the array to filter
         * @param testedValue the value to filter against
         * @returns {Array} the array with the filtered values
         */
        return function (inputs, testedValue) {
            var newArray = [];
            angular.forEach(inputs, function (item) {
                // Check if item or some sub attibute of item matches testedValue. Depending on how you want to filter

                //whenever there is a match use the following line to add the item to the resulting array.
                //newArray.push(item);
            });
            return newArray;
        };
    }

}
