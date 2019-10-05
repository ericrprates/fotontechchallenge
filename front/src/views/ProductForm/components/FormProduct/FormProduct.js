import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import validate from 'validate.js';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  CircularProgress
} from '@material-ui/core';
import api from '../../../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import reducers from '../../../../constants/reducers';

const useStyles = makeStyles(() => ({
  root: {},
  destroyBtn: {
    marginLeft: 'auto'
  }
}));

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32,
      minimum: 4
    }
  },
  description: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
      minimum: 4
    }
  },
  price: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32,
      minimum: 1
    },
    numericality: true
  }
};

const FormProduct = props => {
  const { className, history, product, ...rest } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  useEffect(() => {
    setFormState({
      isValid: false,
      values: { ...product },
      touched: {},
      errors: {}
    });
  }, [product]);
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const token = useSelector(state => state.user.token);

  const handleProduct = async event => {
    event.preventDefault();
    setLoading(true);
    const response = !product
      ? await api.post(
          '/products',
          {
            ...formState.values
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      : await api.patch(
          `/products/${product._id}`,
          {
            ...formState.values
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
    dispatch({
      type: !product ? reducers.products.create : reducers.products.update,
      product: response.data
    });
    setLoading(false);
    history.push('/products');
  };

  const handleDeleteProduct = async event => {
    event.preventDefault();
    try {
      setLoading(true);
      await api.delete(`/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({
        type: reducers.products.delete,
        product
      });

      history.push('/products');
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate onSubmit={handleProduct}>
        <CardHeader
          subheader={!product ? 'New product form' : 'Update product'}
          title="Product"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                margin="dense"
                name="name"
                error={hasError('name')}
                helperText={hasError('name') ? formState.errors.name[0] : null}
                onChange={handleChange}
                required
                value={formState.values.name || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                margin="dense"
                name="description"
                onChange={handleChange}
                error={hasError('description')}
                helperText={
                  hasError('description')
                    ? formState.errors.description[0]
                    : null
                }
                required
                rows="4"
                multiline
                value={formState.values.description || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                margin="dense"
                name="price"
                onChange={handleChange}
                error={hasError('price')}
                helperText={
                  hasError('price') ? formState.errors.price[0] : null
                }
                required
                type="number"
                value={formState.values.price || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          {!loading ? (
            <Button color="primary" type="submit" variant="contained">
              {!product ? 'Save' : 'Update'}
            </Button>
          ) : (
            <CircularProgress />
          )}
          <Button
            color="secondary"
            variant="contained"
            onClick={() => history.goBack()}>
            Back
          </Button>
          {product && (
            <Button
              color="default"
              variant="contained"
              className={classes.destroyBtn}
              onClick={handleDeleteProduct}>
              Destroy
            </Button>
          )}
        </CardActions>
      </form>
    </Card>
  );
};

FormProduct.propTypes = {
  className: PropTypes.string
};

export default FormProduct;
