import * as React from 'react';
import {ScrollView, View, NativeScrollEvent} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {TableHeaderType, TableSortOps} from '@utils/types';

import TableHeader from './TableHeader';

type Props = {
  headers: TableHeaderType[];
  sortOp: TableSortOps;
  rows: any[];
  renderCell: (header: TableHeaderType, row: any) => React.ReactElement;
  onSortChanged?: (sortOp: TableSortOps) => any;
  onScroll?: ({nativeEvent}: {nativeEvent: NativeScrollEvent}) => void;
};

export default React.memo<Props>(function AppDataTable(props: Props) {
  const {styles} = useStyles(getStyles);

  const {headers, sortOp, rows, renderCell, onSortChanged, onScroll} = props;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {headers.map((header, index) => (
          <TableHeader
            header={header}
            sortOp={sortOp}
            key={index}
            onSortChanged={onSortChanged}
          />
        ))}
      </View>
      <ScrollView
        style={styles.rowContainer}
        onScroll={onScroll}
        scrollEventThrottle={300}>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            <View
              style={[
                styles.row,
                index % 2 !== 1 ? styles.rowOdd : styles.rowEven,
              ]}>
              {headers.map((header) => (
                <View style={[styles.cell, header.style]} key={header.value}>
                  {renderCell(header, row)}
                </View>
              ))}
            </View>
            <View
              style={
                index % 2 !== 1 && rows.length === index + 1
                  ? styles.noBorder
                  : styles.divider
              }
            />
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    paddingVertical: 0,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: themeStyle.scale(15),
    paddingTop: themeStyle.scale(10),
    paddingBottom: themeStyle.scale(5),
  },
  rowContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: themeStyle.scale(15),
  },
  divider: {
    flexDirection: 'row',
    height: 1,
    backgroundColor: themeStyle.lightBorderColor,
    marginLeft: themeStyle.scale(15),
  },
  rowOdd: {},
  rowEven: {
    backgroundColor: themeStyle.lightGray,
  },
  noBorder: {
    borderWidth: 0,
  },
  cell: {
    paddingVertical: themeStyle.scale(5),
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anBold',
      size: 16,
    }),
    alignSelf: 'flex-end',
  },
});
