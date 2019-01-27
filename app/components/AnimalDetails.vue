<script>
  import EventForm from './EventForm'
  import EventsFilterModal from './EventsFilterModal'
  import App from './App'
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
        let ids = this.sortedEventIds.filter((eventId) => {
          let event = this.events[eventId];
          return event && event.animalId === this.animalId && (!this.fitlerValue || event.type === this.fitlerValue);
        });

        if((!this.fitlerValue || this.fitlerValue === 'Other') && this.animal) {
          if(this.animal.arrival) {
            ids.push(-1)
          }

          if(this.animal.birthdate) {
            ids.push(-2)
          }
        }

        return ids;
      },

      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },
    },

    methods: {
      addEvent(type) {
        this.$navigateTo(EventForm, {props: {
          eventAnimalId: this.animalId,
          eventType: type,
        }})
      },

      filterList() {
        this.$showModal(EventsFilterModal, { props: { currentFilter: this.filter }})
        .then((selected) => {
          this.filter = selected;
        });
      },

      eventIcon(id) {
        if(id === -1) {
          return 0xf175;
        }
        else if(id === -2) {
          return 0xf122;
        }

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
          case 'Maintenance':
            return 0xf1ed;
          default:
            return 0xf27d;
        }
      },

      eventNotes(id) {
        let event = this.events[id];

        if(!event) {
          return null;
        }

        return event.notes;
      },

      eventDisplay(id) {
        let dateString, timestamp, details, hour, minute, suffix, date, time, event,
            animalName = this.animal.name;


        if(id === -1) {
          details = `${animalName}'s arrival`;
          date = this.animal.arrival;
        }
        else if(id === -2) {
          details = `${animalName}'s birthdate`;
          date = this.animal.birthdate;
        }
        else {
          event = this.events[id];
          if(!event) {
            return '';
          }

          date = event.date;
          time = event.time;
          switch(event.type) {
            case 'Feeding':
              details = `Fed ${animalName}`
              break;
            case 'Handling':
              details = `Handled ${animalName} for ${event.value} minutes`
              break;
            case 'Weight':
              details = `Weighed ${animalName}: ${event.value}g`
              break;
            case 'Shedding':
              details = `${animalName} shed`
              break;
            case 'Maintenance':
              details = `Maintenance for ${animalName}`
              break;
            default:
              details = `${animalName}`
          }
        }

        dateString = `${date.month + 1}/${date.day}/${date.year % 1000}`;

        if(time) {
          hour = time.hour <= 12 ? time.hour : time.hour -12;
          minute = time.minute < 10 ? `0${time.minute}` : time.minute;
          suffix = time.hour < 12 ? 'am' : 'pm';
          timestamp = ` ${hour}:${minute} ${suffix}`;
        }
        else {
          timestamp = '';
        }

        return `${dateString}${timestamp} - ${details}`;
      },

      onSwipeStarted ({ data, object }) {
        const swipeLimits = data.swipeLimits;
        const swipeView = object;
        const leftItem = swipeView.getViewById('left-swipe');
        const rightItem = swipeView.getViewById('right-swipe');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
      },

      editEvent({ object }) {
        if(object.bindingContext >= 0) {
          this.$navigateTo(EventForm, {props: { eventId: object.bindingContext }});
        } else {
          alert('Cannot edit default events');
        }
      },

      deleteEvent({ object }) {
        if(object.bindingContext >= 0) {
          let event = this.events[object.bindingContext];
          this.$store.commit('removeEvent', object.bindingContext);

          if(event && event.type === 'Feeding') {
            this.$store.commit('recalculateLastFed', event.animalId);
          }
        } else {
          alert('Cannot remove default events');
        }
      },

      goBack() {
        this.$navigateTo(App);
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *, auto, auto">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="goBack" col="0" />
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

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Maintenance')">
          <Label class="icon" :text="String.fromCharCode(0xf1ed)" />
          <Label class="title" text="Maintenance" />
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addEvent('Other')">
          <Label class="icon" :text="String.fromCharCode(0xf27d)" />
          <Label class="title" text="Other" />
        </StackLayout>
      </StackLayout>

      <StackLayout ~mainContent>
        <RadListView
          for="id in eventIdsForAnimal"
          class="list-group"
          swipeActions="true"
          @itemSwipeProgressStarted="onSwipeStarted"
        >
          <v-template>
            <StackLayout class="list-group-item list-group-item--events" orientation="horizontal">
              <Label class="icon" :text="String.fromCharCode(eventIcon(id))" />
              <StackLayout>
                <Label :text="eventDisplay(id)" />
                <Label v-if="eventNotes(id)" class="list-group-item-text" :text="eventNotes(id)" />
              </StackLayout>
            </StackLayout>
          </v-template>

          <v-template name="itemswipe">
            <GridLayout columns="auto, *, auto" backgroundColor="White">
              <FlexboxLayout id="left-swipe" col="0" class="swipe-item left" @tap="editEvent">
                <Label class="icon swipe-action" :text="String.fromCharCode(0xf158)" />
              </FlexboxLayout>
              <FlexboxLayout id="right-swipe" col="2" class="swipe-item right" @tap="deleteEvent">
                <Label class="icon swipe-action" :text="String.fromCharCode(0xf154)" />
              </FlexboxLayout>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
