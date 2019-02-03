<script>
  const moment = require("moment")

  export default {
    props: {
      event: {
        type: Object,
        required: true,
      },

      animalName: {
        type: String,
        default: 'Unknown',
      },
    },

    computed: {
      eventIcon() {
        if(this.event.id === -1) {
          return 0xf175;
        }
        else if(this.event.id === -2) {
          return 0xf122;
        }

        switch(this.event.type) {
          case 'Feeding':
            return 0xf153;
          case 'Handling':
            return 0xf207;
          case 'Weight':
            return 0xf1bb;
          case 'Shedding':
            return 0xf254;
          case 'Maintenance':
            return 0xf1ed;
          default:
            return 0xf27d;
        }
      },

      processedTimeStamp() {
        return moment(this.event.timestamp);
      },

      eventTimestamp() {
        if(this.event.id === -1 || this.event.id === -2) {
          return this.processedTimeStamp.format("M/D/YY");
        }
        else {
          return this.processedTimeStamp.format("M/D/YY h:mm a");
        }
      },

      eventDetails() {
        if(this.event.id === -1) {
          return `${this.animalName}'s arrival`;
        }
        else if(this.event.id === -2) {
          return `${this.animalName}'s birthdate`;
        }

        switch(this.event.type) {
          case 'Feeding':
            return `Fed ${this.animalName}`
          case 'Handling':
            return `Handled ${this.animalName} for ${this.event.value} minutes`
          case 'Weight':
            return `Weighed ${this.animalName}: ${this.event.value}g`
          case 'Shedding':
            return `${this.animalName} shed`
          case 'Maintenance':
            return `Maintenance for ${this.animalName}`
          default:
            return `${this.animalName}`
        }
      },
    }
  }
</script>

<template>
  <StackLayout class="list-group-item list-group-item--events" orientation="horizontal">
    <Label class="icon" :text="String.fromCharCode(eventIcon)" />
    <StackLayout>
      <Label :text="`${eventTimestamp} - ${eventDetails}`" />
      <Label v-if="event.notes" class="list-group-item-text" :text="event.notes" />
    </StackLayout>
  </StackLayout>
</template>
