<template>
<v-row justify="center">
      <v-dialog
        v-model="dialog"
                max-width="600px"
      >
      <v-card>
          <v-card-title>
            <span class="headline">Choose Your Repo To Sell</span>
          </v-card-title>
          <v-card-text>
          <v-card
    class="mx-auto"
    max-width="344"
    outlined
    :key="index"
v-for="(item, index) in allRepo"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          {{item.isPrivate?"PRIVATE":"PUBLIC"}}
        </div>
        <v-list-item-title class="headline mb-1">
          {{item.name}}
        </v-list-item-title>
        <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ><v-img :src="item.openGraphImageUrl"/></v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn
        v-if="!item.added"
        rounded

        color="blue"
        :disabled="disabled"
        @click="listRepo(item)"
      >
        LIST REPO
      </v-btn>

    </v-card-actions>
  </v-card>
            <v-row justify="center" class="mt-2">
               <v-btn
      class="mx-2"
      fab
      dark
      large
      color="cyan"
      :disabled="!pageInfo_.hasPreviousPage||disabled"
      @click="getAllRepo(undefined,pageInfo_.startCursor)"
    >
      <v-icon>
        fas fa-arrow-left
      </v-icon>
    </v-btn>
                <v-btn
      class="mx-2"
      fab
      dark
      large
      color="cyan"
      :disabled="!pageInfo_.hasNextPage||disabled"
      @click="getAllRepo(pageInfo_.endCursor,undefined)"
    >
      <v-icon>
        fas fa-arrow-right
      </v-icon>
    </v-btn>
            </v-row>

          </v-card-text>

        </v-card>
      </v-dialog>
    </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly dialog!: boolean
  @Prop({ required: true }) readonly allRepo!: Array<object>
  @Prop({ required: true }) readonly pageInfo_!: object
  @Prop({ required: true }) readonly disabled!: boolean
@Emit()
  getAllRepo(after_: string,before_:string) {
    return { after_,before_ }
  }
  @Emit()
  listRepo(item:object) {
    return { item}
  }
 
}
</script>


