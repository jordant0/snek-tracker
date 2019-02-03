<script>
  import EventForm from './EventForm'
  import EventsFilterModal from './EventsFilterModal'
  import EventInfo from './EventInfo'
  import { mapState } from 'vuex'

  export default {
    components: {
      EventInfo,
    },

    props: {
      animalId: {
        type: String,
        default: null,
      },
    },

    data() {
      return {
        eventsList: [],
        animal: {},
        filter: 0,
      }
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

      this.$database.getAnimalData(this.uid, this.animalId)
      .then(doc => {
        this.animal = doc.data();
        this.animal.birthdate = new Date(this.animal.birthdate);
        this.animal.arrival = new Date(this.animal.arrival);
      })
      .catch(err => {
        console.error(err);
        this.alert(err);
      });

      this.collectionSubscriber = this.loadCollection();
    },

    computed: {
      ...mapState([
        'uid',
      ]),

      fitlerValue() {
        if(this.filter && this.filters[this.filter] !== 'All') {
          return this.filters[this.filter];
        }
        else {
          return null;
        }
      },

      filteredEventsList() {
        let events = this.eventsList.filter((event) => {
          return event && (!this.fitlerValue || event.type === this.fitlerValue);
        });

        if(!this.fitlerValue || this.fitlerValue === 'Other') {
          if(this.animal.arrival) {
            events.push({
              id: -1,
              timestamp: this.animal.arrival,
            })
          }

          if(this.animal.birthdate) {
            events.push({
              id: -2,
              timestamp: this.animal.birthdate,
            })
          }
        }

        return events;
      },
    },

    methods: {
      loadCollection(object) {
        return this.$database.eventsCollection(this.uid, this.animalId).orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          this.eventsList = [];
          snapshot.forEach(doc => {
            this.eventsList.push(Object.assign({id: doc.id}, doc.data()));
          });

          if(object) {
            object.notifyPullToRefreshFinished();
          }
        });
      },

      addEvent(type) {
        this.$navigateTo(EventForm, {props: {
          animalId: this.animalId,
          eventType: type,
        }})
      },

      filterList() {
        this.$showModal(EventsFilterModal, { props: { currentFilter: this.filter }})
        .then((selected) => {
          this.filter = selected;
        });
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
        let event = object.bindingContext;
        if(event.id === -1 || event.id === -2) {
          alert('Cannot edit default events');
        } else {
          this.$navigateTo(EventForm, {props: {
            eventId: event.id,
            animalId: this.animalId,
            eventType: event.type,
          }});
        }
      },

      deleteEvent({ object }) {
        let event = object.bindingContext;
        if(event.id === -1 || event.id === -2) {
          alert('Cannot remove default events');
        } else {
          this.$database.deleteEvent(this.uid, this.animalId, event.id);
        }
      },

      goBack() {
        this.$navigateBack();
      },

      refreshData({ object }) {
        this.collectionSubscriber();
        this.collectionSubscriber = this.loadCollection(object);
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
        <StackLayout v-if="filteredEventsList.length">
          <RadListView
            for="event in filteredEventsList"
            class="list-group"
            swipeActions="true"
            @itemSwipeProgressStarted="onSwipeStarted"
            pullToRefresh="true"
            @pullToRefreshInitiated="refreshData"
          >
            <v-template>
              <EventInfo :event='event' :animalName='animal.name' />
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
        <FlexboxLayout v-else class="list-empty">
          <Label text="No events found" />
        </FlexboxLayout>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
