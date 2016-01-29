export default class ImageMock{
    constructor($interpolate){
        this.restrict = "E";

        this.$interpolate = $interpolate;
    }

    controller ($scope, $attrs, $interpolate, mockPicturePathPattern, picturePlaceholder) {
        "ngInject";

        let ngSrc = $attrs.ngSrc;

        if(ngSrc){
            let src = $interpolate(ngSrc)($scope);
            if(mockPicturePathPattern.test(src)){
                $attrs.$set("ngSrc", picturePlaceholder);
            }
        }
    }

    static factory($interpolate){
        "ngInject";

        return new ImageMock($interpolate);
    }
}