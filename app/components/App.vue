<script>
  import { mapGetters } from 'vuex'
  import AnimalForm from './AnimalForm'
  import AnimalDetails from './AnimalDetails'

  export default {
    data() {
      return {
        msg: 'Why!'
      }
    },

    computed: {
      ...mapGetters([
        'animalsList'
      ])
    },

    methods: {
      addAnimal() {
        this.$navigateTo(AnimalForm)
      },

      resetData() {
        confirm({
          title: 'Reset Data',
          message: 'Are you sure you want to reset all data?',
          okButtonText: 'Reset',
          cancelButtonText: 'Cancel'
        }).then(result => {
          this.$store.commit('reset');
        });
      },

      viewAnimal(event) {
        if(event.item) {
          this.$navigateTo(AnimalDetails, {props: {animalId: event.item.id}})
        }
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

      editAnimal({ object }) {
        this.$navigateTo(AnimalForm, {props: { animalId: object.bindingContext.id }})
      },

      deleteAnimal({ object }) {
        this.$store.commit('removeAnimal', object.bindingContext.id);
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="icon" :text="String.fromCharCode(0xf197)" @tap="$refs.drawer.nativeView.showDrawer()" col="0" />
        <Label class="title" text="Herps Tracker"  col="1"/>
        <Label class="icon" :text="String.fromCharCode(0xf278)" @tap="addAnimal" col="2" paddingLeft="10" />
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <FlexboxLayout ~drawerContent class="sidedrawer-content">
        <StackLayout>
          <Label class="sidedrawer-header" text="Menu"/>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="addAnimal">
            <Label class="icon" :text="String.fromCharCode(0xf1ff)" />
            <Label class="title" text="Add Animal" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" flexShrink="0" @tap="resetData">
          <Label class="icon text-danger" :text="String.fromCharCode(0xf1f4)" />
          <Label class="title text-danger" text="Reset" />
        </StackLayout>
      </FlexboxLayout>

      <StackLayout ~mainContent>
        <StackLayout v-if="animalsList.length">
          <RadListView
            for="animal in animalsList"
            class="list-group"
            swipeActions="true"
            @itemSwipeProgressStarted="onSwipeStarted"
            @itemTap="viewAnimal"
          >
            <v-template>
              <StackLayout class="list-group-item">
                <Label class="list-group-item-heading" :text="animal.name" />
                <Label v-if="animal.species" class="list-group-item-text" :text="animal.species" />

                <Label v-if="animal.lastFed" class="list-group-item-text" :text="`Last Fed: ${animal.lastFed.month + 1}/${animal.lastFed.day}/${animal.lastFed.year}`" />
                <Label v-else-if="animal.feedingDuration" class="list-group-item-text" :text="`Feeding every ${animal.feedingDuration} day(s)`" />

                <Label v-if="animal.birthdate" class="list-group-item-text" :text="`Birthdate: ${animal.birthdate.month + 1}/${animal.birthdate.day}/${animal.birthdate.year}`" />
                <Label v-if="animal.arrival" class="list-group-item-text" :text="`Arrived: ${animal.arrival.month + 1}/${animal.arrival.day}/${animal.arrival.year}`" />
              </StackLayout>
            </v-template>

            <v-template name="itemswipe">
              <GridLayout columns="auto, *, auto" backgroundColor="White">
                <FlexboxLayout id="left-swipe" col="0" class="swipe-item left" @tap="editAnimal">
                  <Label class="icon swipe-action" :text="String.fromCharCode(0xf158)" />
                </FlexboxLayout>
                <FlexboxLayout id="right-swipe" col="2" class="swipe-item right" @tap="deleteAnimal">
                  <Label class="icon swipe-action" :text="String.fromCharCode(0xf154)" />
                </FlexboxLayout>
              </GridLayout>
            </v-template>
          </RadListView>
          </RadListView >
        </StackLayout>
        <FlexboxLayout v-else class="list-empty">
          <Label text="No animals added yet" />
        </FlexboxLayout>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
