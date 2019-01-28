<script>
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
      };
    },

    computed: {
      birthdate() {
        return this.processDate(this.animal.birthdate);
      },

      age() {
        let duration, years, months,
            ageString = [];

        if(this.birthdate) {
          years = this.today.diff(this.birthdate, 'years');
          months = this.today.diff(this.birthdate, 'months') % 12;

          if(years) {
            ageString.push(years == 1 ? '1 year' : `${years} years`);
          }

          if(months) {
            ageString.push(months == 1 ? '1 month' : `${months} months`);
          }

          return `${ageString.join(' and ')} old`;
        }
        return null;
      },

      lastFed() {
        return this.processDate(this.animal.lastFed);
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
          return { status: 'text-success', text: 'Today' }
        } else if(this.feedingDiff) {
          if(this.feedingDiff > 0) {
            return { status: 'text-primary', text: `In ${this.feedingDiff} day(s)` }
          } else {
            return { status: 'text-danger', text: `${-this.feedingDiff} day(s) ago` }
          }
        }
        return null;
      },
    },

    methods: {
      processDate(date) {
        if(date) {
          return moment(this.dateString(date));
        }
        return null;
      },

      dateString(date) {
        return `${date.year}-${date.month + 1}-${date.day}`
      },

      dateDisplay(date) {
        return date.format('MMM DD YYYY');
      },
    },
  }
</script>

<template>
  <StackLayout class="list-group-item">
    <FlexboxLayout justifyContent="space-between">
      <FlexboxLayout alignItems="center">
        <Label class="list-group-item-heading" :text="animal.name" />
        <Label v-if="animal.species" class="list-group-item-text" :text="`- ${animal.species}`" marginLeft="5" padding="0" />
      </FlexboxLayout>

      <Label v-if="age" class="list-group-item-text" :text="age" padding="0" />
    </FlexboxLayout>


    <StackLayout>
      <Label v-if="feedingInfo" :class="`list-group-item-text ${feedingInfo.status}`" :text="`Next Feeding: ${feedingInfo.text}`" />
      <Label v-else-if="animal.lastFed" class="list-group-item-text" :text="`Last Fed: ${dateDisplay(lastFed)}`" />
      <Label v-else-if="animal.feedingDuration" class="list-group-item-text" :text="`Feeding every ${animal.feedingDuration} day(s)`" />
    </StackLayout>
  </StackLayout>
</template>
