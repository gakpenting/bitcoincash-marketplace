<template>
  <div>
    <v-row class="mb-2" v-if="refreshRepo"
      ><v-btn @click="getAllRepo" :disabled="disabled">SELL REPO</v-btn></v-row
    >
    <v-row>
      <v-card
        width="400"
        class="mx-2 my-2"
        :key="index"
        v-for="(item, index) in listRepo"
      >
        <v-card-title>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end"> {{item.isPrivate?"Private":"Public"}}</v-row>
          </v-list-item>
        </v-card-title>

        <v-card-text class="text-md font-weight-bold">
          <v-list-item>
            <v-list-item-content>{{ item.description }}</v-list-item-content>
            <v-list-item-avatar tile size="100" color="grey">
              <v-img :src="item.openGraphImageUrl" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card-text>
        <v-card-action
          ><v-row class="d-flex align-content-center mx-5">

            <v-col class="d-flex mt-2 justify-end">

              <v-btn v-if="ownedRepo" target="_blank" :href="item.url"
                >GO TO URL</v-btn
              >
            </v-col>
          </v-row></v-card-action
        >
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
    @Prop({ required: true }) readonly listRepo!: Array<object>
  @Prop({ required: true }) readonly ownedRepo!: boolean
    @Prop({ required: true }) readonly disabled!: boolean

}
</script>

