<script>
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
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf278)" @tap="$refs.drawer.nativeView.showDrawer()" col="0" />
        <Label class="title" :text="animal.name"  col="1"/>
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <FlexboxLayout ~drawerContent class="sidedrawer-content">
        <StackLayout>
          <Label class="sidedrawer-header" text="Add Event"/>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf153)" />
            <Label class="title" text="Feeding" />
          </StackLayout>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf207)" />
            <Label class="title" text="Handling" />
          </StackLayout>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf1bb)" />
            <Label class="title" text="Weight" />
          </StackLayout>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf254)" />
            <Label class="title" text="Shedding" />
          </StackLayout>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal">
            <Label class="icon" :text="String.fromCharCode(0xf27d)" />
            <Label class="title" text="Other" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" flexShrink="0">
          <Label class="icon" :text="String.fromCharCode(0xf2fa)" />
          <Label class="title" text="Back" @tap="$navigateBack" />
        </StackLayout>
      </FlexboxLayout>

      <StackLayout ~mainContent>
        <Label :text="animal.name" />

        <Label :text="birthdate" />

        <Label :text="animal.type" />

        <Label :text="animal.species" />
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
