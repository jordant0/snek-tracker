<script>
  import AddEvent from './AddEvent'
  import EventsFilterModal from './EventsFilterModal'
  import { mapState, mapGetters } from 'vuex'

  export default {
    props: {
      animalId: {
        type: Number,
        default: 0,
      },
    },

    created() {
      this.filters = {
        0: 'All',
        1: 'Feeding',
        2: 'Handling',
        3: 'Weight',
        4: 'Shedding',
        5: 'Other',
      }
    },

    data() {
      return {
        filter: 0,
      }
    },

    computed: {
      ...mapState([
        'events'
      ]),

      ...mapGetters([
        'sortedEventIds',
      ]),

      fitlerValue() {
        if(this.filter && this.filters[this.filter] !== 'All') {
          return this.filters[this.filter];
        }
        else {
          return null;
        }
      },

      eventIdsForAnimal() {
        return this.sortedEventIds.filter((eventId) => {
          let event = this.events[eventId];
          return event && event.animalId === this.animalId && (!this.fitlerValue || event.type === this.fitlerValue);
        });
      },

      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },
    },

    methods: {
      addEvent(type) {
        this.$navigateTo(AddEvent, {props: {
          animalId: this.animalId,
          type,
        }})
      },

      filterList() {
        this.$showModal(EventsFilterModal, { props: { currentFilter: this.filter }})
        .then((selected) => {
          this.filter = selected;
        });
      },

      eventIcon(id) {
        let event = this.events[id];

        if(!event) {
          return 0xf27d;
        }

        switch(event.type) {
          case 'Feeding':
            return 0xf153;
          case 'Handling':
            return 0xf207;
          case 'Weight':
            return 0xf1bb;
          case 'Shedding':
            return 0xf254;
          default:
            return 0xf27d;
        }
      },

      eventDisplay(id) {
        let date, timestamp, details, notes, hour, minute, suffix,
            animalName = this.animal.name,
            event = this.events[id];

        if(!event) {
          return '';
        }

        date = `${event.date.month + 1}/${event.date.day}/${event.date.year}`;
        notes = event.notes ? ` ${event.notes}` : '';

        if(event.time) {
          hour = event.time.hour <= 12 ? event.time.hour : event.time.hour -12;
          minute = event.time.minute < 10 ? `0${event.time.minute}` : event.time.minute;
          suffix = event.time.hour < 12 ? 'AM' : 'PM';
          timestamp = ` at ${hour}:${minute} ${suffix}`;
        }

        switch(event.type) {
          case 'Feeding':
            details = `Fed ${animalName}`
            break;
          case 'Handling':
            details = `Handled ${animalName}`
            break;
          case 'Weight':
            details = `Weight ${animalName}: ${event.value}g`
            break;
          case 'Shedding':
            details = `${animalName} shed`
            break;
          default:
            details = `${animalName}`
        }
        return `${date} - ${details}${timestamp}: ${notes}`
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *, auto, auto">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="$navigateBack" col="0" />
        <Label class="title" :text="animal.name"  col="1"/>
        <Label class="icon" :text="String.fromCharCode(0xf160)" @tap="filterList" col="2" paddingLeft="10" paddingRight="10" />
        <Label class="icon" :text="String.fromCharCode(0xf278)" @tap="$refs.drawer.nativeView.showDrawer()" col="3" paddingLeft="10" />
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer" drawerLocation="Right">
      <StackLayout ~drawerContent class="sidedrawer-content">
        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Feeding')">
          <Label class="icon" :text="String.fromCharCode(0xf153)" />
          <Label class="title" text="Feeding" />
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Handling')">
          <Label class="icon" :text="String.fromCharCode(0xf207)" />
          <Label class="title" text="Handling" />
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Weight')">
          <Label class="icon" :text="String.fromCharCode(0xf1bb)" />
          <Label class="title" text="Weight" />
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Shedding')">
          <Label class="icon" :text="String.fromCharCode(0xf254)" />
          <Label class="title" text="Shedding" />
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Other')">
          <Label class="icon" :text="String.fromCharCode(0xf27d)" />
          <Label class="title" text="Other" />
        </StackLayout>
      </StackLayout>

      <StackLayout ~mainContent>
        <ListView for="id in eventIdsForAnimal" class="list-group">
          <v-template>
            <StackLayout class="list-group-item list-group-item--events" orientation="horizontal">
              <Label class="icon" :text="String.fromCharCode(eventIcon(id))" />
              <Label :text="eventDisplay(id)" />
            </StackLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
