/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, NativeScrollEvent} from 'react-native';
import {setAction} from '@redux/actions';
import {useSelector} from 'react-redux';

import type {ThemeStyle as StyleType} from '@utils/styles';
import {useStyles} from '@global/Hooks';
import {TableSortOps, Vendor, Catalog} from '@utils/types';
import {emptyTableSortOption} from '@utils/constants';
import VendorRow from './vendorRow';
import {VendorsState} from '@redux/reducers/vendors';
import {AppHeader, AppSearchInput, CircularLoading} from '@root/components';
import {SortOpsByVendor} from '@root/redux/reducers/catalogs';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';

const FETCH_COUNT = 20;

export default function Catalogs({
  navigation,
}: AppNavProps<AppRouteEnum.Catalogs>) {
  const {styles} = useStyles(getStyles);
  const {vendors, searchText: vendorSearchText, sortOptions} = useSelector(
    (state: any): VendorsState => state.vendors,
  );
  const [offset, setOffset] = useState<number>(0);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendorsSortOps, setVendorsSortOps] = useState<SortOpsByVendor[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  useEffect(() => {
    onFilterCatalog(vendorSearchText);
  }, [vendorSearchText]);

  useEffect(() => {
    const filtered = filterVendors(vendorSearchText, vendors);
    const newData = filtered.slice(offset, offset + FETCH_COUNT);
    let newVendors: Vendor[] = [];
    if (offset > 0) {
      newVendors = filteredVendors.slice();
    }
    newVendors = newVendors.concat(newData);
    setFilteredVendors(newVendors);
    sortVendors(newVendors);
    setLoadingData(false);
  }, [offset]);

  const onFilterCatalog = (text: string) => {
    const filtered = filterVendors(text, vendors);
    setFilteredVendors(filtered);
    sortVendors(filtered);
    setSearchText(text);
    setAction('vendors', {searchText: text});
    setOffset(0);
  };

  const onSortChanged = (sortOp: TableSortOps, index: number) => {
    const newVendorSortOps = vendorsSortOps.slice();
    newVendorSortOps[index].sortOps = sortOp;
    setVendorsSortOps(newVendorSortOps);
    setAction('vendors', {sortOptions: newVendorSortOps});
  };

  const filterVendors = (text: string, v: Vendor[]) => {
    if (text) {
      const filteredVendor = v.filter(
        (vendor: Vendor) =>
          vendor.name.toLowerCase().indexOf(text.toLowerCase()) > -1,
      );
      v.forEach((item) => {
        const matchItems = item.catalog_items.filter(
          (catalog: Catalog) =>
            catalog.name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
            catalog.sku.toLowerCase().indexOf(text.toLowerCase()) > -1,
        );
        if (matchItems.length > 0) {
          if (filteredVendor.findIndex((it) => it.id === item.id) < 0) {
            const newV = Object.assign({}, item);
            newV.catalog_items = matchItems;
            filteredVendor.push(newV);
          }
        }
      });
      return filteredVendor;
    }
    return v;
  };

  const sortVendors = (v: Vendor[]) => {
    const sortOps: SortOpsByVendor[] = v.map((vendor) => {
      const index = sortOptions.findIndex(
        (option) => option.vendor_id === vendor.id,
      );
      if (index > -1) {
        return sortOptions[index];
      }
      const newSortOpt: SortOpsByVendor = {
        sortOps: emptyTableSortOption,
        vendor_id: vendor.id,
      };
      return newSortOpt;
    });
    setVendorsSortOps(sortOps.slice());
    setAction('vendors', {sortOptions: sortOps.slice()});
  };

  const onContainerScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }): void => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    if (loadingData) {
      return;
    }
    if (layoutMeasurement.height > contentSize.height) {
      if (contentOffset.y > 60) {
        setOffset(offset + FETCH_COUNT);
        setLoadingData(true);
      }
    } else {
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height + 60
      ) {
        setOffset(offset + FETCH_COUNT);
        setLoadingData(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Catalog'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <AppSearchInput value={searchText} onChange={onFilterCatalog} />
        }
      />
      <View style={styles.mainContent}>
        <ScrollView
          onScroll={onContainerScroll}
          scrollEventThrottle={300}
          style={styles.container}>
          {filteredVendors.map((item, index) => (
            <VendorRow
              key={`vendor-row-${item.id}-${vendorsSortOps.length}`}
              navigation={navigation}
              vendorName={item.name}
              catalogs={item.catalog_items}
              catalogSortOps={vendorsSortOps[index].sortOps}
              sortChanged={(sortOps: TableSortOps) =>
                onSortChanged(sortOps, index)
              }
            />
          ))}
          {!loadingData && filteredVendors.length === 0 && (
            <Text style={styles.centerText}>No Result</Text>
          )}
          <CircularLoading loading={loadingData} />
        </ScrollView>
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  noSpacing: {
    letterSpacing: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
  loader: {
    marginTop: 25,
    marginBottom: 25,
  },
  mainContent: {
    flex: 1,
    marginTop: 10,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
