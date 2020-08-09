import React from 'react';
import {View, Image, TouchableOpacity, Alert} from 'react-native';
import numeral from 'numeral';
import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import {useMutation} from '@apollo/client';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  LineItemWithSwitch,
  LineItem,
  AppGradButton,
} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {LineItemType, Agreement} from '@root/utils/types';
import {CREATE_AGREEMENT} from '../../graphql';

const ElanCatalogs = [
  {
    title: 'Seat',
    items: [
      {
        id: 7,
        cost: 36740,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Power-Assisted Swivel Seat',
        price: 72900,
        sku: 'SRE-30528',
        taxable: true,
        vendor_id: 1,
        subcategory: 'seat',
      },
      {
        id: 11,
        cost: 36740,
        category: 'Stairlifts',
        description: 'For SRE-2010',
        name: 'Power-Assisted Swivel Seat',
        price: 79000,
        sku: 'SRE-21153',
        taxable: true,
        vendor_id: 1,
        subcategory: 'seat',
      },
    ],
  },
  {
    title: 'Footrest',
    items: [
      {
        id: 6,
        cost: 29260,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Automatic Folding Footrest',
        price: 50000,
        sku: 'SRE-30525',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Footrest',
      },
      {
        id: 12,
        cost: 23320,
        category: 'Stairlifts',
        description: 'For SRE-2010',
        name: 'Automatic Folding Footrest',
        price: 50000,
        sku: 'SRE-21143',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Footrest',
      },
    ],
  },
  {
    title: 'Rail',
    items: [
      {
        id: 4,
        cost: 73040,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Power Folding Rail',
        price: 140000,
        sku: 'SRE-30529',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Rail',
      },
      {
        id: 5,
        cost: 36740,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Manual Folding Rail',
        price: 70000,
        sku: 'SRE-30530',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Rail',
      },
      {
        id: 9,
        cost: 36740,
        category: 'Stairlifts',
        description: 'For SRE-2010',
        name: 'Manual Folding Rail',
        price: 70000,
        sku: 'SRE-30379',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Rail',
      },
      {
        id: 10,
        cost: 73040,
        category: 'Stairlifts',
        description: 'For SRE-2010',
        name: 'Power Folding Rail',
        price: 140000,
        sku: 'SRE-30372',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Rail',
      },
    ],
  },
  {
    title: 'Additional Rail Options',
    items: [
      {
        id: 3,
        cost: 13420,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: "20' Rail Installation Kit",
        price: 25500,
        sku: 'SRE-K-3065',
        taxable: true,
        vendor_id: 1,
        type: 'switch',
      },
    ],
  },
];

export default function ElanTemplate({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.TEMPLATES>) {
  const {parent = '', itemTitle = '', contact, templateId} = route.params || {};

  const {items} = useSelector((state: any) => state.cart);
  const {styles} = useStyles(getStyles);
  const [inset_agreement] = useMutation(CREATE_AGREEMENT, {
    onCompleted(data) {
      const agreement: Agreement = data.insert_agreements.returning[0];
      Alert.alert('New Quote was successfully created.');
      navigation.popToTop();
      navigation.navigate(AppRouteEnum.AgreementDetails, {
        parent: 'Contacts',
        agreement,
        contact: contact,
        itemTitle: `${contact.name_first} ${contact.name_last}`,
      });
    },
  });

  const updateQty = (item: LineItemType, qty: number) => {
    const itemIndex = items.findIndex((it: LineItemType) => it.id === item.id);
    if (itemIndex < 0) {
      items.push(item);
    }
    const newItems = items.map((it: LineItemType) => {
      if (it.id === item.id) {
        it.quantity = qty;
        return it;
      }
      return it;
    });
    setAction('cart', {items: newItems});
  };
  const chooseItem = (item: LineItemType) => {
    const newItems = items.slice();
    const itemIndex = newItems.findIndex(
      (it: LineItemType) => it.id === item.id,
    );
    if (itemIndex < 0) {
      let itemIndex2 = newItems.findIndex(
        (it: LineItemType) => it.subcategory === item.subcategory,
      );
      while (itemIndex2 > -1) {
        newItems.splice(itemIndex2, 1);
        itemIndex2 = newItems.findIndex(
          (it: LineItemType) => it.subcategory === item.subcategory,
        );
      }
      newItems.push(item);
    } else {
      newItems.splice(itemIndex, 1);
    }
    setAction('cart', {items: newItems});
  };

  const createQuote = () => {
    // Create an agreement
    const lineItems = items.map((item: LineItemType) => ({
      catalog_item_id: item.id,
      current_cost: item.cost,
      price: item.price,
      qty: item.quantity ? item.quantity : 1,
      taxable: item.taxable,
      discount: 0,
    }));
    inset_agreement({
      variables: {
        billing_address_id: contact.address_id,
        agreement_template_id: templateId,
        contact_id: contact.id,
        shipping_address_id: contact.address_id,
        line_items: lineItems,
      },
    });
  };

  // Calculate Total Price
  let totalPrice = 0;
  items.map((item: LineItemType) => {
    if (item.quantity !== undefined) {
      totalPrice += item.price * item.quantity;
    } else {
      totalPrice += item.price;
    }
  });

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title={parent} onClick={() => navigation.pop()} />
        }
        rightContent={
          <TouchableOpacity
            style={styles.switchText}
            onPress={() => {
              navigation.pop();
              navigation.pop();
            }}>
            <AppText size={16} font={'anSemiBold'} color={'textLightPurple'}>
              Cancel
            </AppText>
          </TouchableOpacity>
        }
        pageTitle={itemTitle}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <View style={styles.mainContent}>
        {ElanCatalogs.map((catalog: any, index: number) => (
          <View style={styles.block} key={`catalog-${index}`}>
            <AppText color={'textBlack2'} size={24} font={'anSemiBold'}>
              {catalog.title}
            </AppText>
            {catalog.items.map((item: LineItemType, id: number) => (
              <>
                {item.type === 'switch' ? (
                  <LineItemWithSwitch
                    key={id}
                    item={item}
                    qty={
                      items[
                        items.findIndex((it: LineItemType) => it.id === item.id)
                      ]?.quantity || 0
                    }
                    setQty={(num) => updateQty(item, num)}
                  />
                ) : (
                  <LineItem
                    key={id}
                    active={
                      items.findIndex((it: LineItemType) => it.id === item.id) >
                      -1
                    }
                    item={item}
                    setActive={() => chooseItem(item)}
                  />
                )}
              </>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.bottomBtnView}>
        <AppGradButton
          containerStyle={styles.createBtnContainer}
          textStyle={styles.createBtnText}
          btnStyle={styles.createBtn}
          title={`$${numeral(totalPrice / 100).format('0,0.00')} or $${numeral(
            totalPrice / 100 / 60,
          ).format('0,0.00')}/month`}
          leftIconContent={<></>}
          onPress={createQuote}
        />
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  searchContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(50),
    paddingHorizontal: themeStyle.scale(20),
  },
  galleryContainer: {
    marginTop: themeStyle.scale(30),
  },
  marginRight15: {
    marginRight: themeStyle.scale(30),
    paddingVertical: 20,
  },
  imageStyle: {
    width: '100%',
    resizeMode: 'contain',
    height: 400,
  },
  slideItem: {
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  itemContent: {
    width: '100%',
    paddingHorizontal: '15%',
    borderRightWidth: 1,
    borderRightColor: '#C6C6C8',
    paddingBottom: 30,
  },
  descriptionText: {
    color: themeStyle.textBlack2,
    lineHeight: 30,
    fontSize: 16,
  },
  ctaBtnContainer: {
    alignItems: 'center',
  },
  ctaBtn: {
    textAlign: 'center',
    width: '40%',
  },
  ctaInnerBtn: {
    paddingRight: 0,
    paddingLeft: 20,
  },
  diagonalBox: {
    backgroundColor: themeStyle.backgroundWhite,
    paddingVertical: 10,
    paddingHorizontal: 50,
    transform: [{rotate: '-45deg'}, {translateY: '15%'}, {translateX: '-65%'}],
    position: 'absolute',
    top: 0,
    left: 0,
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  block: {
    paddingBottom: 40,
  },
  bottomBtnView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  createBtnContainer: {
    width: '100%',
  },
  createBtn: {
    borderTopLeftRadius: 0,
    paddingVertical: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    fontSize: 30,
  },
  createBtnText: {
    textTransform: 'uppercase',
  },
});
