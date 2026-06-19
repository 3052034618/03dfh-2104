import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface TagSelectorProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  multiple?: boolean
  accent?: boolean
}

const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  selected,
  onChange,
  multiple = true,
  accent = false
}) => {
  const handleSelect = (option: string) => {
    if (multiple) {
      if (selected.includes(option)) {
        onChange(selected.filter(s => s !== option))
      } else {
        onChange([...selected, option])
      }
    } else {
      onChange(selected.includes(option) ? [] : [option])
    }
  }

  return (
    <View className={styles.container}>
      {options.map(option => {
        const isSelected = selected.includes(option)
        return (
          <View
            key={option}
            className={classnames(
              styles.tag,
              isSelected && styles.tagSelected,
              accent && styles.tagAccent,
              accent && isSelected && styles.tagAccentSelected
            )}
            onClick={() => handleSelect(option)}
          >
            <Text
              className={classnames(
                styles.tagText,
                isSelected && styles.tagTextSelected,
                accent && isSelected && styles.tagTextAccentSelected
              )}
            >
              {option}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default TagSelector
