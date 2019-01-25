<script>
  import { mapGetters } from 'vuex'
  import AddAnimal from './AddAnimal'
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
        this.$navigateTo(AddAnimal)
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
        <ListView for="animal in animalsList" class="list-group" @itemTap="viewAnimal">
          <v-template>
            <StackLayout class="list-group-item">
              <Label class="list-group-item-heading" :text="animal.name" />
              <Label v-if="animal.type" class="list-group-item-text" :text="animal.type" />
              <Label v-if="animal.species" class="list-group-item-text" :text="animal.species" />
              <Label v-if="animal.birthdate" class="list-group-item-text" :text="`${animal.birthdate.month + 1}/${animal.birthdate.day}/${animal.birthdate.year}`" />
            </StackLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
