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
    Template.expenses.got_expenses = function () {
        return Template.expenses.expenses().count() > 0;
    }

    Template.expense.timestamp_display = function () {
        if (this.timestamp) {
            return moment(new Date(localize_timestamp_utc(this.timestamp))).format("DD/MM/YYYY");
        } else {
            return "-";
        }
    };
    Template.expense.amount_display = function () {
        if (this.amount) {
            return this.amount.toFixed(2);
        }
        return "";
    };

    Template.addexpense.events = {
        'click input.add': function () {
            Session.set("addexpense_error", "");
            desc_str = $(".addexpense input.desc").val();
            amount_str = $(".addexpense input.amount").val();
            if (desc_str.length <= 0) {
                Session.set("addexpense_error", "Please enter a description.");
                return;
            }
            if (amount_str.length <= 0) {
                Session.set("addexpense_error", "Please enter an amount.");
                return;
            }
            amount = parseFloat(amount_str);
            if (isNaN(amount)) {
                Session.set("addexpense_error", "Please enter a valid amount.");
                return;
            }
            timestamp = get_timestamp_now_utc();
            Expenses.insert({
                timestamp: timestamp,
                desc: desc_str,
                amount: amount
            });
            $(".addexpense input[type=text]").val("");
            $(".addexpense input.desc").focus();
        }
    };

    Template.addexpense.error  = function () {
        return Session.get("addexpense_error");
    };
}

if (Meteor.is_server) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
