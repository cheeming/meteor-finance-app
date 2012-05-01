Expenses = new Meteor.Collection("expenses");


function get_timestamp_now_utc() {
    d = new Date();
    return d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
}


function localize_timestamp_utc(timestamp_utc) {
    d = new Date();
    return timestamp_utc - (d.getTimezoneOffset() * 60 * 1000);
}


if (Meteor.is_client) {
    Template.expenses.expenses = function () {
        return Expenses.find({}, {sort: {timestamp: -1}});
    };
    Template.expense.timestamp_display = function () {
        if (this.timestamp) {
            return moment(new Date(localize_timestamp_utc(this.timestamp))).format("DD/MM/YYYY");
        } else {
            return "-";
        }
    };

    Template.addexpense.events = {
        'click input.add': function () {
            name = $(".addexpense input.name").val();
            amount = parseFloat($(".addexpense input.amount").val());
            timestamp = get_timestamp_now_utc();
            Expenses.insert({
                timestamp: timestamp,
                name: name,
                amount: amount
            });
            $(".addexpense input[type=text]").val("");
        }
    };
}

if (Meteor.is_server) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
