/**
 * 验证状态处理
 */
export class StateHandler {
    private condition: boolean = false
    private rejectCondition: (() => void) | null = null
    private resolveCondition: (() => void) | null = null

    isCondition() {
        return this.condition
    }

    reset() {
        this.condition = false
        this.clearPromises()
    }

    setConditionFalse() {
        this.condition = false
        if (this.rejectCondition) {
            this.rejectCondition()
            this.clearPromises()
        }
    }

    setConditionTrue() {
        this.condition = true
        if (this.resolveCondition) {
            this.resolveCondition()
            this.clearPromises()
        }
    }

    waitForCondition(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.condition) {
                resolve()
            } else {
                this.resolveCondition = resolve
                this.rejectCondition = reject
            }
        })
    }

    private clearPromises() {
        this.resolveCondition = null
        this.rejectCondition = null
    }
}
