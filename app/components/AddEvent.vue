<script>
  import AnimalDetails from './AnimalDetails'

  export default {
    props: {
      animalId: {
        type: Number,
        default: 0,
      },

      type: {
        type: String,
        default: 'Feeding',
      },
    },

    data() {
      return {
        date: new Date(),
        time: new Date(),
        value: null,
        notes: '',
      }
    },

    computed: {
      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },

      animalName() {
        if(this.animal && this.animal.name) {
          return `Add ${this.type} Event for ${this.animal.name}`;
        }
        else {
          return `Add ${this.type} Event`;
        }
      },
    },

    methods: {
      addEvent() {
        this.$store.commit('addEvent', {
          animalId: this.animalId,
          type: this.type,
          date: this.date,
          time: this.time,
          value: this.value,
          notes: this.notes,
        });

        this.$navigateTo(AnimalDetails, {props: {animalId: this.animalId.id}})
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="$navigateBack" col="0" />
        <Label class="title" :text="animalName"  col="1"/>
      </GridLayout>
    </ActionBar>

    <FlexboxLayout flexDirection="column" justifyContent="space-between">
      <ScrollView>
        <StackLayout>
          <StackLayout class="form-field">
            <Label class="label" text="Date" />
            <DatePicker v-model="date" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Time" />
            <TimePicker v-model="time" />
          </StackLayout>

          <StackLayout v-if="type === 'Weight'" class="form-field" marginBottom="20">
            <Label class="label" text="Weight" />
            <TextField v-model="value" keyboardType="number" hint="In grams" />
          </StackLayout>

          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Notes" />
            <TextField v-model="notes" hint="Notes..." />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button class="btn btn-primary" text="Add" flexShrink="0" @tap="addEvent" />
    </FlexboxLayout>
  </Page>
</template>
