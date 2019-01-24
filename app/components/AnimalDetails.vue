<script>
  import AddEvent from './AddEvent'

  export default {
    props: {
      animalId: {
        type: Number,
        default: 0,
      },
    },

    computed: {
      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },

      birthdate() {
        let date = this.animal.birthdate;

        if(date) {
          return `${date.month}/${date.day}/${date.year}`;
        }
        else {
          return '';
        }
      },
    },

    methods: {
      addEvent(type) {
        this.$navigateTo(AddEvent, {props: {
          animalId: this.animalId,
          type,
        }})
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="$navigateBack" col="0" />
        <Label class="title" :text="animal.name"  col="1"/>
        <Label class="icon" :text="String.fromCharCode(0xf278)" @tap="$refs.drawer.nativeView.showDrawer()" col="2" paddingLeft="10" />
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
        <Label :text="animal.name" />

        <Label :text="birthdate" />

        <Label :text="animal.type" />

        <Label :text="animal.species" />
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
