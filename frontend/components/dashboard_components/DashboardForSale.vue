<template>
  <div>
    <v-row class="mb-2"
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

            <v-row align="center" justify="end">
              {{ item.isPrivate ? 'Private' : 'Public' }}
            </v-row>
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
            <v-col class="justify-start align-content-center">

              <div
                class="d-flex align-center text-h5"
                :style="{ height: '100%',cursor:'pointer' }"
                v-if="item.sell === 'SELL'"
                @click="convertCrypto(item.amount, convertTo)"
              >
                {{ convertTo === 'satoshi' ? 'tBCH' : 'satoshi' }}
                {{ convertCrypto(item.amount,convertTo === 'satoshi' ? 'tBCH' : 'satoshi') }}

              </div>

              <v-text-field
                v-if="item.sell === 'UNLIST'"
                label="Amount"
                type="number"
                outlined
                prefix="satoshi"
                :disabled="!btchToken"
                v-model="item.amount"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex mt-2 justify-end">
              <v-btn
                class="white--text"
                @click="sellRepo(item.name, item.amount)"
                color="red"
                v-if="item.sell === 'UNLIST'"
                :disabled="!btchToken || disabled"
                >SELL</v-btn
              ><v-btn
                :disabled="!btchToken || disabled"
                v-if="item.sell === 'SELL'"
                @click="unlistRepo(item.repo_id)"
                >UNLIST</v-btn
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
import { configs } from '@/utils/configs.js'

@Component
export default class MyStore extends Vue {
  @Prop({ required: false }) readonly refreshRepo!: void
  @Prop({ required: false }) readonly btchToken!: boolean
  @Prop({ required: true }) readonly listRepo!: Array<object>
  @Prop({ required: true }) readonly amountRefresh!: number
  @Prop({ required: true }) readonly ownedRepo!: boolean
  @Prop({ required: true }) readonly disabled!: boolean

  public convertTo: string = 'tBCH'
  public amount: number = this.amountRefresh
  convertCrypto(amount:number, to = 'satoshi') {
    const url = configs.url
    if (to === 'satoshi') {
      this.convertTo = 'tBCH'
      return amount
    } else {
      this.convertTo = 'satoshi'
      return amount/100000000;

    }
  }
  @Emit()
  getAllRepo() {}
  @Emit()
  sellRepo(name: string, amount: number) {
    return { name, amount }
  }
  @Emit()
  unlistRepo(repo_id: string) {
    return { repo_id }
  }
}
</script>

