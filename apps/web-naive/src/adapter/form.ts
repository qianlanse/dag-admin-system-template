import type { ComponentType } from './component'

import { setupDagForm, useDagForm as useForm } from '@dag/common-ui'
import { $t } from '@dag/locales'

async function initSetupDagForm() {
    setupDagForm<ComponentType>({
        config: {
            baseModelPropName: 'value',
            modelPropNameMap: {
                Checkbox: 'checked',
                Radio: 'checked',
                Switch: 'checked',
                Upload: 'fileList'
            }
        },
        defineRules: {
            required: (value, _, ctx) => {
                if (value === undefined || value === null || value.length === 0) {
                    return $t('ui.formRules.required', [ctx.label])
                }
                return true
            },
            selectRequired: (value, _, ctx) => {
                if (value === undefined || value === null) {
                    return $t('ui.formRules.selectRequired', [ctx.label])
                }
                return true
            }
        }
    })
}

const useDagForm = useForm<ComponentType>

export { initSetupDagForm, useDagForm }
