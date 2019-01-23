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
      }
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf197)" @tap="$refs.drawer.nativeView.showDrawer()" col="0" />
        <Label class="title" text="Snek Tracker"  col="1"/>
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <FlexboxLayout ~drawerContent class="sidedrawer-content">
        <StackLayout>
          <Label class="sidedrawer-header" text="Menu"/>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf1ff)" />
            <Label class="title" text="Add Animal" @tap="addAnimal" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" flexShrink="0">
          <Label class="icon text-danger" :text="String.fromCharCode(0xf1f4)" />
          <Label class="title text-danger" text="Reset" @tap="resetData" />
        </StackLayout>
      </FlexboxLayout>

      <StackLayout ~mainContent>
        <ListView for="animal in animalsList" class="list-group" @itemTap="viewAnimal">
          <v-template>
            <Label class="list-group-item list-group-item-heading" :text="`${animal.name} (${animal.type})`" />
          </v-template>
        </ListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
