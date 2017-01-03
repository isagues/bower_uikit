import { $, fastdom } from '../util/index';

export default function (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        update: {

            handler() {

                fastdom.clear(this._measure);

                this._measure = fastdom.measure(() => {

                    if (this.$el[0].offsetHeight === 0) {
                        return;
                    }

                    this.stacks = true;

                    var columns = this.$el.children().filter((_, el) => el.offsetHeight > 0),
                        rows = [[columns.get(0)]];

                    columns.slice(1).each((_, el) => {

                        var top = Math.ceil(el.offsetTop), bottom = top + el.offsetHeight;

                        for (var index = rows.length - 1; index >= 0; index--) {
                            var row = rows[index], rowTop = Math.ceil(row[0].offsetTop);

                            if (top >= rowTop + row[0].offsetHeight) {
                                rows.push([el]);
                                break;
                            }

                            if (bottom > rowTop) {

                                this.stacks = false;

                                if (el.offsetLeft < row[0].offsetLeft) {
                                    row.unshift(el);
                                    break;
                                }

                                row.push(el);
                                break;
                            }

                            if (index === 0) {
                                rows.splice(index, 0, [el]);
                                break;
                            }

                        }

                    });

                    fastdom.mutate(() =>
                        rows.forEach((row, i) =>
                            row.forEach((el, j) =>
                                $(el)
                                    .toggleClass(this.margin, i !== 0)
                                    .toggleClass(this.firstColumn, j === 0)
                            )
                        )
                    );

                });



            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}