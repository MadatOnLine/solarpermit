// These substrings get you hundreds or thousands of results so we
// avoid searching for them, opting instead to wait for the user to
// type another character
var COMMON = ["ille", "vill", "land", "owns", "svil", "ship", "nshi",
              "wnsh", "ield", "fiel", "burg", "ngto", "ingt", "gton",
              "ford", "ring", "town", "sbur", "ston", "wood", "ount",
              "ster", "orth", "prin", "nton", "ings", "lton", "nvil",
              "dale", "idge", "reen", "outh"];

function nothing() {
    // do nothing, on purpose
}
var ourWidget = { initializeAutocomplete: function () {
                      this.select = this.widget.find('select.value-select');
                      var box = this.box = this.widget.find('select.box'); 
                      var deck = this.deck = this.widget.find('select.sbsdeck');
                      this.autocomplete = this.input
                                              .yourlabsAutocomplete({ box: this.box,
                                                                      fixPosition: nothing,
                                                                      hide: nothing,
                                                                      move: nothing,
                                                                      boxMouseenter: nothing,
                                                                      boxMouseleave: nothing,
                                                                      boxClick: nothing,
                                                                      minimumCharacters: 4,
                                                                      refresh: function () {
                                                                                   this.value = this.getQuery();
                                                                                   if (this.value.length > 4 ||
                                                                                       COMMON.indexOf(this.value) === -1) {
                                                                                       yourlabs.Autocomplete
                                                                                               .prototype
                                                                                               .refresh
                                                                                               .call(this);
                                                                                   }
                                                                               }
                                                                    });
                      var self = this;
                      $("button.select").click(function () {
                                                   box.find(':selected')
                                                      .each(function () {
                                                                self.selectChoice($(this));
                                                            });
                                               });
                      $("button.deselect").click(function () {
                                                     deck.find(':selected')
                                                         .each(function () {
                                                                   self.deselectChoice($(this));
                                                               });
                                                 });
                  },
                  selectChoice: function (choice) {
                      var self = this;
                      var values = choice.data('value-multiple');
                      if (values) {
                          this.freeDeck();
                          this.addToDeck(choice, choice.data('value'));
                          if (typeof values === "string") {
                              values = values.split(",");
                          } else if (typeof values === "number") {
                              values = [values];
                          }
                          values.map(function (v) {
                                         yourlabs.Widget
                                                 .prototype
                                                 .addToSelect
                                                 .call(self, choice, v);
                                     });
                          var index = $(':input:visible').index(this.input);
                          this.resetDisplay();
                          if (this.input.is(':visible')) {
                              this.input.focus();
                          } else {
                              var next = $(':input:visible:eq('+ index +')');
                              next.focus();
                          }
                          if (this.clearInputOnSelectChoice === "1")
                              this.input.val('');
                      } else {
                          yourlabs.Widget.prototype.selectChoice.call(this, choice);
                      }
                  },
                  deselectChoice: function (choice) {
                      var self = this;
                      var values = choice.data('value-multiple');
                      if (values) {
                          if (typeof values === "string") {
                              values = values.split(",");
                          } else if (typeof values === "number") {
                              values = [values];
                          }
                          values.map(function (v) {
                                         self.select
                                             .find('option[value="'+v+'"]')
                                             .remove();
                                     });
                          this.select.trigger('change');
                          choice.remove();
                          this.updateAutocompleteExclude();
                          this.resetDisplay();
                      } else {
                          yourlabs.Widget.prototype.deselectChoice.call(this, choice);
                      }
                  },
                  updateAutocompleteExclude: function () {
                      var widget = this;
                      var choices = this.select.find("[value]");
                      this.autocomplete.data['exclude'] = $.map(choices,
                                                                function(choice) { 
                                                                    return $(choice).attr("value");
                                                                });
                  },
                  hide: nothing
                };

$(document).bind('yourlabsWidgetReady',
                 function() {
                     $('body').on('initialize',
                                  '.autocomplete-light-widget[data-widget-bootstrap=side-by-side]',
                                  function() {
                                      $(this).yourlabsWidget(ourWidget);
                                  });
                 });
