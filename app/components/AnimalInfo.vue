<script>
  import { mapState } from 'vuex'
  const moment = require("moment")

  export default {
    props: {
      animal: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        today: moment(0, 'HH'),
        lastFedTimestamp: null,
      };
    },

    watch: {
      lastFed() {
        this.today.set({
          'hour': this.lastFed.hour(),
          'minute': this.lastFed.minute(),
        });
      },
    },

    created() {
      this.$database.eventsCollection(this.uid, this.animal.id).where("type", "==", "Feeding").orderBy("timestamp", "desc").limit(1).onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.lastFedTimestamp = doc.data().timestamp;
        });
      });
    },

    computed: {
      ...mapState([
        'uid',
      ]),

      birthdate() {
        return this.processDate(this.animal.birthdate);
      },

      age() {
        let duration, years, months,
            ageString = [];

        if(this.birthdate) {
          years = this.today.diff(this.birthdate, 'years');
          if(years >= 1) {
            return `${this.pluralize(years, 'year')} old`;
          }
          else {
            months = this.today.diff(this.birthdate, 'months');
            return `${this.pluralize(months, 'month')} old`;
          }
        }
        return null;
      },

      lastFed() {
        return this.processDate(this.lastFedTimestamp);
      },

      nextFeed() {
        if(this.lastFed && this.animal.feedingDuration) {
          return this.lastFed.add(this.animal.feedingDuration, 'd');
        }
        return null;
      },

      feedingDiff() {
        if(this.nextFeed) {
          return this.nextFeed.diff(this.today, 'days');
        }
        return null;
      },

      feedingInfo() {
        if(this.feedingDiff === 0) {
          return { status: 'text-success', text: 'Today!' }
        } else if(this.feedingDiff) {
          if(this.feedingDiff > 0) {
            return { status: 'text-primary', text: `In ${this.pluralize(this.feedingDiff, 'day')}` }
          } else {
            return { status: 'text-danger', text: `${this.pluralize(-this.feedingDiff, 'day')} ago` }
          }
        }
        return null;
      },
    },

    methods: {
      processDate(date) {
        if(date) {
          return moment(date);
        }
        return null;
      },

      dateDisplay(date) {
        return date.format('MMM DD YYYY');
      },

      pluralize(count, noun) {
        if(count === 1) {
          return `${count} ${noun}`;
        }
        else {
          return `${count} ${noun}s`;
        }
      },
    },
  }
</script>

<template>
  <StackLayout class="list-group-item">
    <FlexboxLayout justifyContent="space-between" alignItems="center">
      <FlexboxLayout alignItems="center">
        <Label class="list-group-item-heading" :text="animal.name" />
        <Label v-if="animal.species" class="list-group-item-text" :text="`- ${animal.species}`" marginLeft="5" padding="0" />
      </FlexboxLayout>

      <Label v-if="age" class="list-group-item-text" :text="age" padding="0" />
    </FlexboxLayout>


    <StackLayout>
      <Label v-if="feedingInfo" :class="`list-group-item-text ${feedingInfo.status}`" :text="`Next Feeding: ${feedingInfo.text}`" />
      <Label v-else-if="animal.lastFed" class="list-group-item-text" :text="`Last Fed: ${dateDisplay(lastFed)}`" />
      <Label v-else-if="animal.feedingDuration" class="list-group-item-text" :text="`Feeding every ${pluralize(animal.feedingDuration, 'day')}`" />
    </StackLayout>
  </StackLayout>
</template>
