import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  IconButton,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { ProductsToolbar, ProductCard } from './components';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import reducers from '../../constants/reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  progress: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
}));

const ProductList = ({ history }) => {
  const classes = useStyles();

  const products = useSelector(state => state.products.data);
  const token = useSelector(state => state.user.token);
  const [page, setPage] = useState(1);
  //eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalProducts, setTotalProducts] = useState(0);
  const [timeout, setTimeoutX] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      try {
        const response = await api.get('/products', {
          params: { page: page - 1, itemsPerPage },
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalProducts(response.data.totalProducts);
        dispatch({
          type: reducers.products.list,
          products: response.data.products
        });
      } catch (e) {
        alert(e);
      }
      setLoading(false);
    }
    getProducts();
  }, [dispatch, token, page, itemsPerPage]);
  const handleNextPage = () => {
    page * itemsPerPage < totalProducts && setPage(page + 1);
  };
  const handlePrevPage = () => {
    page > 1 && setPage(page - 1);
  };
  const handleSearch = async text => {
    try {
      if (timeout) clearTimeout(timeout);
      setTimeoutX(
        setTimeout(async () => {
          setLoading(true);
          const response = await api.get('/products', {
            params: { page: page - 1, itemsPerPage, search: text },
            headers: { Authorization: `Bearer ${token}` }
          });
          setTotalProducts(response.data.totalProducts);
          dispatch({
            type: reducers.products.list,
            products: response.data.products
          });
          setLoading(false);
        }, 300)
      );
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className={classes.root}>
      <ProductsToolbar history={history} handleSearch={handleSearch} />
      <div className={classes.content}>
        <Grid container spacing={3}>
          {!loading &&
            products.map(product => (
              <Grid item key={product._id} lg={4} md={6} xs={12}>
                <ProductCard product={product} history={history} />
              </Grid>
            ))}
          {loading && (
            <div className={classes.progress}>
              <CircularProgress />
            </div>
          )}
        </Grid>
      </div>
      <div className={classes.pagination}>
        <Typography variant="caption">
          {`${page === 1 ? page : page * itemsPerPage - itemsPerPage} - ${
            products.length
          }  of ${totalProducts}`}
        </Typography>
        <IconButton onClick={handlePrevPage}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={handleNextPage}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ProductList;
