import React from 'react'
import { Table } from '../components/table'

export default ({ stories, isAdmin }) => {
  return <Table data={stories} isAdmin={isAdmin} />
}
