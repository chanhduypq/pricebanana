
function showOne(key) {
    var prices = [];
    if (key != '') {
        data = item_type_history[key];
        for (i = 0; i < data.length; i++) {

            date = new Date(data[i]['date']).getTime();
            date = parseFloat(date);
            price = parseFloat(data[i]['price']);
            prices.push([date, price]);

        }
    }
    if (is_admin == '1') {
        var data_quantity = [];
        if (key != '') {
            data = item_type_history[key];
            for (i = 0; i < data.length; i++) {

                date = new Date(data[i]['date']).getTime();
                date = parseFloat(date);
                quantity = parseFloat(data[i]['quantity']);
                data_quantity.push([date, quantity]);

            }
        }

        seriesData = [{
                name: 'Price',
                data: prices,
                tooltip: {
                    valueDecimals: 2,
                    pointFormat: '{series.name}: <b>${point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                },
                color: 'blue'
            },
            {
                name: 'Quantity',
                data: data_quantity,
                tooltip: {
                    valueDecimals: 0,
                    pointFormat: '{series.name}: <b>{point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                }
            }
        ];
    } else {
        seriesData = [{
                name: 'Price',
                data: prices,
                tooltip: {
                    valueDecimals: 2,
                    pointFormat: '{series.name}: <b>${point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                },
                color: 'blue'
            }
        ];
    }

    return seriesData;
}

function showMulti() {
    seriesDataAll = [];
    options = $("#select_inventoryList option");
    selects = $("select[name='level']");
    for (k = 1; k < options.length; k++) {
        key = $(options[k]).attr('value');
        temp = key.split('|');
        run = true;
        for (j = 0; j < selects.length; j++) {
            if (j == 0 && $(selects[j]).val() == '') {
                run = false;
                break;
            }
            if (j > 0 && $(selects[j]).val() != '' && $(selects[j]).val() != temp[j]) {
                run = false;
                break;
            }
            run1 = true;
            for (m = 0; m <= j; m++) {
                if ($(selects[m]).val() != '' && $(selects[m]).val() != temp[m]) {
                    run1 = false;
                    break;
                }
            }
            if (run1 == false) {
                run = false;
                break;
            }

        }

        if (run == true) {
            var prices = [];
            data = item_type_history[key];
            for (i = 0; i < data.length; i++) {

                date = new Date(data[i]['date']).getTime();
                date = parseFloat(date);
                price = parseFloat(data[i]['price']);
                prices.push([date, price]);

            }
            if (is_admin == '1') {
                var data_quantity = [];
                if (key != '') {
                    data = item_type_history[key];
                    for (i = 0; i < data.length; i++) {

                        date = new Date(data[i]['date']).getTime();
                        date = parseFloat(date);
                        quantity = parseFloat(data[i]['quantity']);
                        data_quantity.push([date, quantity]);

                    }
                }

                seriesData = {
                    name: 'Price',
                    data: prices,
                    tooltip: {
                        valueDecimals: 2,
                        pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>${point.y}</b><br/>',
                        shared: true,
                        xDateFormat: '%b %e %Y'
                    },
                    color: 'blue'
                };
                seriesDataAll.push(seriesData);

                seriesData =
                        {
                            name: 'Quantity',
                            data: data_quantity,
                            tooltip: {
                                valueDecimals: 0,
                                pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>{point.y}</b><br/>',
                                shared: true,
                                xDateFormat: '%b %e %Y'
                            }
                        }
                ;
                seriesDataAll.push(seriesData);

            } else {
                seriesData = {
                    name: 'Price',
                    data: prices,
                    tooltip: {
                        valueDecimals: 2,
                        pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>${point.y}</b><br/>',
                        shared: true,
                        xDateFormat: '%b %e %Y'
                    },
                    color: 'blue'
                }
                ;
                seriesDataAll.push(seriesData);
            }


        }
    }


    return seriesDataAll;
}

function resetComboboxChildren(idSelect) {
    valParent = $("#" + idSelect).val();
    index = parseInt(idSelect[idSelect.length - 1]);
    for (i = index + 1; i < $("select[name='level']").length; i++) {
        $("#level" + i).html('<option value="">Please select</option>');
    }
    index++;
    next_options = [];

    for (key in item_type_history) {
        temp = key.split('|');
        run = true;
        for (m = 0; m <= index - 1; m++) {
            if ($("#level" + m).val() != temp[m]) {
                run = false;
                break;
            }
        }
        if (run == true) {
            next_options[temp[index]] = '';

        }
    }

    ar = [];
    for (key in next_options) {
        ar.push(key);
    }
    ar.sort();
    for (i = 0; i < ar.length; i++) {
        key = ar[i];
        $("#level" + index).append('<option value="' + key + '">' + key + '</option>');
    }
}

