import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import apiUrl from '../../apiConfig'
import ReviewForm from '../../shared/ReviewForm'
// import Layout from '../../shared/Layout'

const ReviewEdit = (props) => {
  const [review, setReview] = useState({
    property: '',
    rating: '',
    landlord: '',
    movein: '',
    moveout: '',
    description: ''
  })
  const [updated, setUpdated] = useState(false)

  const { user, msgAlert } = props

  useEffect(() => {
    axios(`${apiUrl}/reviews/${props.match.params.id}`)
      .then(res => setReview(res.data.review))
      .catch(error => {
        msgAlert({
          heading: 'Unable to view reviews: ' + error.message,
          variant: 'danger'
        })
      })
  }, [])

  const handleChange = event => {
    event.persist()
    setReview(review => ({ ...review, [event.target.name]: event.target.value }))
    // const updatedField = { [event.target.name]: event.target.value }

    // const editedMovie = Object.assign(this.state.movie, updatedField)

    // this.setState({ movie: editedMovie })
  }

  const handleSubmit = event => {
    event.preventDefault()
    axios({
      url: `${apiUrl}/reviews/${props.match.params.id}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Token token=${user.token}`
      },
      data: { review }
    })
      .then(() => setUpdated(true))
      .then(() => msgAlert({
        heading: 'Edited Review',
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Unable to edit reviews: ' + error.message,
          variant: 'danger'
        })
      })
  }

  if (updated) {
    return <Redirect to={`/view-reviews/${props.match.params.id}`} />
  }

  return (
    <ReviewForm
      review={review}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      cancelPath={`/reviews/${props.match.params.id}`}
    />
  )
}

export default ReviewEdit
