import React from 'react';

import { Box, Card, CardContent, Container, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { CreateButton, EditButton } from '../../../components/TableComponents/TableButtons';
import { useProduct, useProductImages, useProductReviews, useProductTags } from '../../../hooks/queries/productQueries';
import { formatDate } from '../../../utils/formatDate';
import { formatPriceForDisplay } from '../../../utils/priceFormat';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import ProductImagesGrid from './ProductImages/ProductImagesGrid';
import ProductReviewsTable from './ProductReviews/ProductReviewsTable';
import ProductTagsTable from './ProductTags/ProductTagsTable';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },

  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

function PreviewProduct({ productId }) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: product } = useProduct(productId);
  const { data: productTags } = useProductTags(productId);
  const { data: productImages } = useProductImages(productId);
  const { data: productReviews } = useProductReviews(productId);

  const { category, brand, ...productData } = product ?? {};

  const properties = transformKeysToSnakeCase(productData?.properties);

  return (
    <Container component='main' maxWidth='md'>
      <Card className={classes.root} variant='outlined'>
        <div className={classes.tabs}>
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='product view and relations tabs'
              variant='fullWidth'
            >
              <Tab label='Product' {...a11yProps(0)} />
              <Tab label='Category' {...a11yProps(1)} />
              <Tab label='Brand' {...a11yProps(2)} />
              <Tab label='Tags' {...a11yProps(3)} />
              <Tab label='Images' {...a11yProps(4)} />
              <Tab label='Reviews' {...a11yProps(5)} />
            </Tabs>
          </div>
          <CardContent>
            <TabPanel value={value} index={0}>
              <PreviewItem title='ID' value={productData?.id} />
              <PreviewItem title='Name' value={productData?.name} />
              <PreviewItem title='Slug' value={productData?.slug} />
              <PreviewItem title='Description' value={productData?.description} />
              <PreviewItem title='SKU' value={productData?.sku} />
              <PreviewItem title='Price' value={`$${formatPriceForDisplay(productData?.price)}`} />
              <PreviewItem
                title='Image URL'
                value={<a href={productData?.imageUrl || ''}>{productData?.imageUrl}</a>}
              />
              <PreviewItem title='Image Public ID' value={productData?.imagePublicId} />
              <PreviewItem title='In Stock' value={category?.inStock ? 'Yes' : 'No'} />
              <PreviewItem title='Is Featured' value={category?.isFeatured ? 'Yes' : 'No'} />
              <PreviewItem title='Created at' value={formatDate(productData?.createdAt)} />
              <PreviewItem title='Updated at' value={formatDate(productData?.updatedAt)} />

              <PreviewItem title='Properties' value='' style={{ marginTop: '2rem' }} />
              {category?.properties?.map((prop, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                    {prop?.label} -
                  </Typography>
                  <Typography variant='h5' color='textPrimary' gutterBottom style={{ marginLeft: 10 }}>
                    {typeof properties?.[prop?.name] === 'boolean'
                      ? properties?.[prop?.name]?.toString()
                      : prop?.choices?.find(x => x?.name === properties?.[prop?.name])?.label}
                  </Typography>
                </div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PreviewItem title='ID' value={category?.id} />
              <PreviewItem title='Name' value={category?.name} />
              <PreviewItem title='Slug' value={category?.slug} />
              <PreviewItem title='Description' value={category?.description} />
              <PreviewItem title='Is Featured' value={category?.isFeatured ? 'Yes' : 'No'} />
              <PreviewItem title='Logo' value={<a href={category?.logo || ''}>{category?.logo}</a>} />
              <PreviewItem title='Logo Public ID' value={category?.logoPublicId} />
              <PreviewItem title='Created at' value={formatDate(category?.createdAt)} />
              <PreviewItem title='Updated at' value={formatDate(category?.updatedAt)} />

              <PreviewItem title='Properties' value='' style={{ marginTop: '2rem' }} />
              {category?.properties?.map((prop, i) => (
                <div key={i} style={{ padding: 10, marginTop: 10, background: i % 2 === 0 ? '#f8f8f8' : '#fff' }}>
                  {Object.entries(prop).map(([k, v], j) => (
                    <div key={`${v}_${j}`} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                        {k}:
                      </Typography>
                      <Typography variant='h5' color='textPrimary' gutterBottom style={{ marginLeft: 10 }}>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {Array.isArray(v) ? JSON.stringify(v) : typeof v === 'boolean' ? v?.toString() : v}
                      </Typography>
                    </div>
                  ))}
                </div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2}>
              <PreviewItem title='ID' value={brand?.id} />
              <PreviewItem title='Name' value={brand?.name} />
              <PreviewItem title='Slug' value={brand?.slug} />
              <PreviewItem title='Type' value={brand?.type} />
              <PreviewItem title='Description' value={brand?.description} />
              <PreviewItem title='Email' value={brand?.email} />
              <PreviewItem title='Website URL' value={<a href={brand?.websiteUrl || ''}>{brand?.websiteUrl}</a>} />
              <PreviewItem title='Logo' value={<a href={brand?.logo || ''}>{brand?.logo}</a>} />
              <PreviewItem title='Logo Public ID' value={brand?.logoPublicId} />
              <PreviewItem title='Created at' value={formatDate(brand?.createdAt)} />
              <PreviewItem title='Updated at' value={formatDate(brand?.updatedAt)} />
            </TabPanel>
            <TabPanel value={value} index={3} disabled>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <CreateButton title='Add Tag' to={`/products/${product?.id}/${product?.slug}/tags/create`} />
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  <EditButton title='Edit Tags' to={`/products/${product?.id}/${product?.slug}/tags/edit`} />
                </div>
              </div>
              {productTags?.length === 0 ? (
                <span>No Tags</span>
              ) : (
                <ProductTagsTable tags={productTags} productId={productId} />
              )}
            </TabPanel>
            <TabPanel value={value} index={4}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                <CreateButton title='Add Images' to={`/products/${product?.id}/${product?.slug}/images/create`} />
              </div>
              {productImages?.length === 0 ? (
                <span>No Images</span>
              ) : (
                <ProductImagesGrid images={productImages} product={product} />
              )}
            </TabPanel>
            <TabPanel value={value} index={5}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                <CreateButton title='Add Review' to={`/products/${product?.id}/${product?.slug}/reviews/create`} />
              </div>
              {productReviews?.length === 0 ? (
                <span>No Reviews</span>
              ) : (
                <ProductReviewsTable reviews={productReviews} product={product} />
              )}
            </TabPanel>
          </CardContent>
        </div>
      </Card>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

export default PreviewProduct;
