<template>
  <div
    class="player-info-card"
    :class="{
      'privacy-private': summonerInfo?.privacy === 'PRIVATE' && !isSelf,
      'win-rate-team': analysis.maybeWinRateTeam && !isSelf
    }"
  >
    <div class="header-line">
      <LcuImage class="avatar" :src="championId ? championIcon(championId) : championIcon(-1)" />
      <div class="header-line-right-side">
        <div class="summoner-name-line">
          <span
            :title="`${summonerInfo?.displayName}${
              summonerInfo?.tagLine ? '#' + summonerInfo.tagLine : ''
            }`"
            class="name"
            @click="emits('toSummoner', id)"
            >{{ summonerInfo?.displayName ? summonerInfo.displayName : '<暂无名称>' }}</span
          >
          <span class="tag self" v-if="isSelf">我</span>
          <NPopover v-if="savedInfo && !isSelf" placement="bottom">
            <template #trigger>
              <span
                :title="`曾在 ${formattedRelativeTime} 遇见过，作为${
                  savedInfo.side === 'teammate' ? '队友' : '对手'
                }，共遇见过 ${savedInfo.relatedGameIds.length} 次`"
                class="tag encountered"
                >遇见过</span
              >
            </template>
            <div style="max-width: 260px">
              <div class="encountered-text">
                最近一次遇见该玩家的时间是 {{ formattedRelativeTime }}，作为{{
                  savedInfo.side === 'teammate' ? '队友' : '对手'
                }}。
              </div>
              <div
                class="encountered-text"
                v-if="savedInfo.summonerInfo.displayName !== summonerInfo?.displayName"
              >
                该召唤师曾用名为
                <span style="font-weight: 700">{{ savedInfo.summonerInfo.displayName }}</span>
              </div>
              <div class="encountered-text" v-if="savedInfo.relatedGameIds.length > 1">
                共遇见过 {{ savedInfo.relatedGameIds.length }} 次。
              </div>
              <div class="encountered-games">
                <span class="encountered-text"
                  >相关对局：<span
                    class="encountered-game"
                    v-for="g of savedInfo.relatedGameIds.slice(-10).toReversed()"
                    @click="() => emits('showGame', g, id)"
                    >{{ g }}</span
                  ></span
                >
              </div>
            </div>
          </NPopover>
          <span
            title="该玩家试图藏住一切，很遗憾这没有效果"
            class="tag privacy-private"
            v-if="summonerInfo?.privacy === 'PRIVATE' && !isSelf"
            >生涯隐藏</span
          >
          <span
            :title="winRateTeamText(id)"
            class="tag win-rate-team"
            v-if="analysis.maybeWinRateTeam && !isSelf"
            >胜率队</span
          >
          <span
            :title="
              analysis.maybeWinRateTeam ? '这，就是胜率队' : `该玩家 ${analysis.winningStreak} 连胜`
            "
            class="tag winning-streak"
            v-if="analysis.winningStreak >= 4"
            >{{ analysis.winningStreak }} 连胜</span
          >
          <span
            :title="`该玩家 ${analysis.losingStreak} 连败`"
            class="tag losing-streak"
            v-if="analysis.losingStreak >= 4"
            >{{ analysis.losingStreak }} 连败</span
          >
        </div>
        <div v-if="rankedStats" class="ranked-stats">
          <RankedSpan :ranked="rankedStats" simple :queue-type="queueType" />
        </div>
      </div>
    </div>
    <div class="content-area">
      <div class="stats">
        <div class="overall">
          <div class="overall-item" v-if="queueType !== 'CHERRY'">
            <span class="value">{{ analysis.averageKda.toFixed(2) }}</span>
            <span class="label">平均 KDA</span>
          </div>
          <div class="overall-item" v-if="queueType !== 'CHERRY'">
            <span class="value">{{ Math.round(analysis.winningRate) }} %</span>
            <span class="label">近期胜率</span>
          </div>
          <div class="overall-item" v-if="queueType === 'CHERRY'">
            <span class="value"
              >{{ Math.round((analysis.cherryTop1s / (analysis.cherryGames || 1)) * 100) }} %</span
            >
            <span class="label">第一</span>
          </div>
          <div class="overall-item" v-if="queueType === 'CHERRY'">
            <span class="value"
              >{{ Math.round((analysis.cherryTop2s / (analysis.cherryGames || 1)) * 100) }} %</span
            >
            <span class="label">前二</span>
          </div>
        </div>
        <div class="player-favorites">
          <template v-if="queueType === 'CHERRY'">
            <div
              class="favorite"
              v-for="c of analysis.champions.filter((c) => c.cherryCount).slice(0, 3)"
            >
              <LcuImage class="image" :src="championIcon(c.championId)"></LcuImage>
              <div class="label" title="前二率">前二率</div>
              <div class="label" title="前二率">
                {{ Math.round((c.top2 / (c.cherryCount || 1)) * 100) }} %
              </div>
              <div class="count">{{ c.cherryCount }} 场</div>
            </div>
            <div
              class="favorite"
              v-if="analysis.champions.filter((c) => c.cherryCount).length === 0"
            >
              <LcuImage class="image" :src="championIcon(-1)"></LcuImage>
              <div class="label" title="无对局">无对局</div>
              <div class="label" title="无对局">无对局</div>
              <div class="count">0 场</div>
            </div>
          </template>
          <template v-else>
            <div class="favorite" v-for="c of analysis.champions.slice(0, 3)">
              <LcuImage class="image" :src="championIcon(c.championId)"></LcuImage>
              <div class="label" title="平均 KDA">{{ c.kda.toFixed(2) }}</div>
              <div class="label" title="英雄胜率">
                {{ Math.round((c.win / (c.count || 1)) * 100) }} %
              </div>
              <div class="count">{{ c.count }} 场</div>
            </div>
            <div class="favorite" v-if="analysis.champions.length === 0">
              <LcuImage class="image" :src="championIcon(-1)"></LcuImage>
              <div class="label" title="无对局">无对局</div>
              <div class="label" title="无对局">无对局</div>
              <div class="count">0 场</div>
            </div>
          </template>
        </div>
        <div class="hint" v-if="queueType === 'CHERRY'">
          统计自最近 {{ analysis.cherryGames }} 场竞技场
        </div>
        <div class="hint" v-else>统计自最近 {{ analysis.validGames }} 场有效对局</div>
      </div>
      <NDivider vertical style="height: 100%" />
      <div v-if="matchHistoryList.length !== 0" v-bind="containerProps" class="match-history">
        <div v-bind="wrapperProps">
          <div
            class="match-history-item"
            :class="{
              remake:
                m.data.selfParticipant.stats.gameEndedInEarlySurrender ||
                m.data.game.gameMode === 'PRACTICETOOL',
              win:
                m.data.game.gameMode !== 'PRACTICETOOL' &&
                !m.data.selfParticipant.stats.gameEndedInEarlySurrender &&
                m.data.selfParticipant.stats.win,
              lose:
                m.data.game.gameMode !== 'PRACTICETOOL' &&
                !m.data.selfParticipant.stats.gameEndedInEarlySurrender &&
                !m.data.selfParticipant.stats.win
            }"
            :style="{
              height: `${matchHistoryItemHeight}px`,
              marginBottom: `${matchHistoryItemMargin}px`
            }"
            v-for="m of list"
            @click="() => emits('showGame', m.data.game.gameId, props.id)"
            :key="m.data.game.gameId"
          >
            <LcuImage class="image" :src="championIcon(m.data.selfParticipant.championId)" />
            <div style="width: 56px">
              <div
                class="mode"
                :title="
                  formatModeText(m.data.game.queueId, m.data.game.gameMode === 'PRACTICETOOL')
                "
              >
                {{ formatModeText(m.data.game.queueId, m.data.game.gameMode === 'PRACTICETOOL') }}
              </div>
              <div class="time">
                {{ dayjs(m.data.game.gameCreation).locale('zh-cn').format('MM-DD') }}
                {{
                  m.data.game.gameMode === 'CHERRY'
                    ? formatResultText(
                        m.data.selfParticipant.stats.win,
                        null,
                        m.data.selfParticipant.stats.subteamPlacement
                      )
                    : formatResultText(
                        m.data.selfParticipant.stats.win,
                        m.data.selfParticipant.stats.gameEndedInEarlySurrender,
                        null,
                        m.data.game.gameMode === 'PRACTICETOOL'
                      )
                }}
              </div>
            </div>
            <span class="k-d-a"
              >{{ m.data.selfParticipant.stats.kills }}/{{ m.data.selfParticipant.stats.deaths }}/{{
                m.data.selfParticipant.stats.assists
              }}</span
            >
          </div>
        </div>
      </div>
      <div v-else class="match-history-placeholder">暂无战绩</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimeoutPoll, useVirtualList } from '@vueuse/core'
import dayjs from 'dayjs'
import { NDivider, NPopover } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import LcuImage from '@renderer/components/LcuImage.vue'
import { championIcon } from '@renderer/features/game-data'
import { getAnalysis, withSelfParticipantMatchHistory } from '@renderer/features/match-history'
import { useGameDataStore } from '@renderer/features/stores/lcu/game-data'
import { MatchHistoryGame, SavedTaggedPlayer } from '@renderer/features/stores/match-history'
import { RankedStats } from '@renderer/types/ranked'
import { SummonerInfo } from '@renderer/types/summoner'
import { winRateTeamText } from '@renderer/utils/sarcasms'

import RankedSpan from '../match-history/widgets/RankedSpan.vue'

const emits = defineEmits<{
  (e: 'toSummoner', id: number): void
  (e: 'showGame', gameId: number, selfId: number): void
}>()

const props = defineProps<{
  id: number
  isSelf: boolean
  summonerInfo?: SummonerInfo
  rankedStats?: RankedStats
  matchHistory?: MatchHistoryGame[]
  championId?: number
  team?: string
  queueType?: string
  savedInfo?: SavedTaggedPlayer

  // 未实装的实验性特性
  isOutstandingPlayer?: boolean
}>()

const gameData = useGameDataStore()

const chineseNumber = ['一', '二', '三', '四']
const formatResultText = (
  win: boolean,
  gameEndedInEarlySurrender?: boolean | null,
  subteamPlacement?: number | null,
  isPracticeTool?: boolean
) => {
  if (subteamPlacement) {
    // 服务器日常抽风导致的，服务器玩元梦之星导致的
    if (subteamPlacement === 0) {
      return '?'
    }
    return chineseNumber[Math.max(subteamPlacement - 1, 0)]
  }

  if (isPracticeTool) {
    return '-'
  }

  if (gameEndedInEarlySurrender) {
    return '重'
  }

  return win ? '胜' : '败'
}

const formatModeText = (queueId: number, isPracticeTool: boolean = false) => {
  if (isPracticeTool) {
    return '训练模式'
  }

  return gameData.queues[queueId].name ?? queueId
}

const formattedRelativeTime = ref('')
const { resume, pause } = useTimeoutPoll(
  () => {
    if (props.savedInfo) {
      formattedRelativeTime.value = dayjs(props.savedInfo.lastMet).locale('zh-cn').fromNow()
    }
  },
  60000,
  { immediate: false }
)

watch(
  () => Boolean(props.savedInfo),
  (e) => (e ? resume() : pause()),
  { immediate: true }
)

const matchHistoryItemHeight = 28
const matchHistoryItemMargin = 2

const matchHistoryList = computed(() => {
  if (props.matchHistory === undefined) {
    return []
  }

  return withSelfParticipantMatchHistory(props.matchHistory, props.id)
})

const { list, containerProps, wrapperProps } = useVirtualList(matchHistoryList, {
  itemHeight: matchHistoryItemHeight + matchHistoryItemMargin,
  overscan: 1
})

const analysis = computed(() => getAnalysis(matchHistoryList.value))
</script>

<style lang="less" scoped>
.player-info-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 4px;
  background-color: rgb(53, 53, 53);
  height: 188px;
}

.player-info-card.privacy-private {
  background-color: rgb(62, 39, 39);
}

.player-info-card.win-rate-team {
  filter: grayscale(1);
}

.header-line {
  display: flex;
  align-items: center;
  height: 42px;

  .avatar {
    border-radius: 50%;
    flex-shrink: 0;
    height: 36px;
    width: 36px;
  }

  .header-line-right-side {
    margin-left: 8px;
  }

  .summoner-name-line {
    display: flex;
    align-items: center;
    gap: 4px;

    .name {
      display: block;
      font-size: 14px;
      cursor: pointer;
      transition: color ease 0.3s;
      flex-shrink: 0;
      max-width: 130px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        color: rgb(231, 231, 231);
      }
    }

    .tag {
      font-size: 10px;
      border-radius: 2px;
      padding: 0 4px;
      background-color: rgb(122, 122, 122);
      flex-shrink: 0;
    }

    .tag.privacy-private {
      background-color: rgb(184, 51, 51);
    }

    .tag.win-rate-team {
      color: rgb(255, 255, 255);
      background-color: rgb(0, 0, 0);
    }

    .tag.encountered {
      background-color: rgb(67, 119, 116);
    }

    .tag.self {
      background-color: rgb(67, 70, 119);
    }

    .tag.winning-streak {
      background-color: rgb(119, 67, 77);
    }

    .tag.losing-streak {
      background-color: rgb(97, 67, 119);
    }
  }

  .ranked-stats {
    font-size: 12px;
  }
}

.encountered-text {
  font-size: 12px;
}

.encountered-games {
  display: flex;
}

.encountered-game {
  font-size: 12px;
  text-decoration: underline;
  font-style: italic;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 4px;
  }
}

.content-area {
  display: flex;
  height: 0;
  flex-grow: 1;
  margin-top: 4px;

  .stats {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .overall {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 16px;
    }

    .overall-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .value {
        font-size: 14px;
        font-weight: 700;
      }

      .label {
        font-size: 12px;
        color: rgb(164, 164, 164);
      }
    }

    .player-favorites {
      display: flex;
      justify-content: center;
      gap: 16px;
      align-items: center;
      flex-grow: 1;
      width: 100%;
      height: 66px;
    }

    .favorite {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image {
        border-radius: 50%;
        height: 32px;
        width: 32px;
        margin-bottom: 2px;
      }

      .label {
        font-size: 12px;
        line-height: 12px;
      }

      .count {
        position: absolute;
        border-radius: 2px;
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 10px;
        right: -4px;
        top: 20px;
        padding: 0 2px;
      }
    }

    .hint {
      font-size: 12px;
      font-style: italic;
      color: rgb(169, 169, 169);
    }
  }

  @match-history-width: 160px;

  .match-history-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: @match-history-width;
    font-size: 12px;
  }

  .match-history {
    width: @match-history-width;

    .match-history-item {
      display: flex;
      align-items: center;
      padding: 0 2px;
      border-radius: 2px;
      margin-right: 2px;
      cursor: pointer;
      transition: all 0.3s ease;

      .image {
        height: 24px;
        width: 24px;
        margin-right: 4px;
      }

      .mode,
      .time {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 10px;
        line-height: 12px;
      }

      .k-d-a {
        font-size: 12px;
        margin-left: 4px;
      }
    }

    .match-history-item:hover {
      filter: brightness(1.1);
    }

    .match-history-item.win {
      background-color: rgba(46, 148, 47, 0.2);
    }

    .match-history-item.lose {
      background-color: rgba(188, 53, 41, 0.2);
    }

    .match-history-item.remake {
      background-color: rgba(255, 255, 255, 0.114);
    }
  }
}
</style>
