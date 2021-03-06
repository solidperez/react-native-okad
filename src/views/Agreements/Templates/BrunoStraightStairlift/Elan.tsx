/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import numeral from 'numeral';
import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import {useMutation} from '@apollo/client';
import Icon from 'react-native-vector-icons/Ionicons';

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
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import {
  LineItemType,
  Agreement,
  Contact,
  AgreementLineItemType,
} from '@root/utils/types';
import {CREATE_AGREEMENT} from '../../graphql';

const ElanCatalogs = [
  {
    title: 'Seat',
    items: [
      {
        id: 7,
        cost: 0,
        installation_fee: 0,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Manual Swivel Seat',
        price: 0,
        sku: 'SRE-30528',
        taxable: true,
        vendor_id: 1,
        subcategory: 'seat',
      },
      {
        id: 11,
        cost: 36740,
        installation_fee: 5000,
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
        cost: 0,
        installation_fee: 0,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Manual Folding Footrest',
        price: 0,
        sku: 'SRE-30525',
        taxable: true,
        vendor_id: 1,
        subcategory: 'Footrest',
      },
      {
        id: 12,
        cost: 23320,
        installation_fee: 0,
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
        cost: 0,
        installation_fee: 0,
        category: 'Stairlifts',
        description: 'For SRE-3050',
        name: 'Fixed Rail',
        price: 0,
        sku: 'SRE-30529',
        taxable: true,
        vendor_id: 1,
        image: true,
        subcategory: 'Rail',
      },
      {
        id: 5,
        cost: 36740,
        installation_fee: 0,
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
        id: 10,
        cost: 73040,
        installation_fee: 0,
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
        installation_fee: 0,
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
}: AppNavProps<AppRouteEnum.TEMPLATES>) {
  const {parent = '', itemTitle = '', contact, template} = route.params || {};
  const {
    userInfo,
    items: cartItems,
    agreements,
    offline_mutations,
    contacts,
    isOnline,
  } = useSelector((state: any) => ({
    userInfo: state.user,
    items: state.cart.items,
    agreements: state.agreements,
    offline_mutations: state.offline_mutations,
    contacts: state.contacts,
    isOnline: state.network.online,
  }));
  const {styles} = useStyles(getStyles);
  const [insert_agreement] = useMutation(CREATE_AGREEMENT, {
    onCompleted(data) {
      // Update agreement number of current usr
      const agreement: Agreement = data.insert_agreements.returning[0];
      const newAgreements = agreements.agreements.slice();
      newAgreements.unshift(agreement);
      setAction('agreements', {agreements: newAgreements});
      const contactsInStore = JSON.parse(JSON.stringify(contacts.contacts));
      const newContacts = contactsInStore.map((ct: Contact) => {
        if (ct.id === contact.id) {
          ct.agreements?.push(agreement);
        }
        return ct;
      });
      setAction('contacts', {contacts: newContacts});
      setAction('user', {
        lastAgreementNumber: userInfo.lastAgreementNumber + 1,
      });
      navigation.navigate(AppRouteEnum.ContactAgreementDetails, {
        agreement,
        contact: contact,
        parent: `${contact.name_first} ${contact.name_last}`,
      });
    },
  });

  useEffect(() => {
    const newItems = cartItems.slice();
    ElanCatalogs.forEach(
      (catalog) =>
        catalog.title !== 'Additional Rail Options' &&
        newItems.push(catalog.items[0]),
    );
    setAction('cart', {items: newItems});
  }, []);

  const updateQty = (item: LineItemType, qty: number) => {
    const itemIndex = cartItems.findIndex(
      (it: LineItemType) => it.id === item.id,
    );
    if (itemIndex < 0) {
      cartItems.push(item);
    }
    const newItems = cartItems.map((it: LineItemType) => {
      if (it.id === item.id) {
        it.qty = qty;
        return it;
      }
      return it;
    });
    setAction('cart', {items: newItems});
  };
  const chooseItem = (item: LineItemType) => {
    const newItems = cartItems.slice();
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
      if (item.installation_fee !== undefined && item.installation_fee > 0) {
        // Add installation_fee as a lineItem;
        newItems.push({
          ...item,
          price: item.installation_fee,
          cost: 0,
        });
      }
    }
    setAction('cart', {items: newItems});
  };

  const createQuote = () => {
    // Create an agreement
    if (isOnline) {
      const lineItems: Partial<AgreementLineItemType>[] = [];
      cartItems.forEach((item: LineItemType) => {
        if (item.price !== 0) {
          lineItems.push({
            catalog_item_id: item.id,
            current_cost: item.cost,
            price: item.price,
            qty: item.qty ? item.qty : 1,
            taxable: item.taxable,
            discount: 0,
          });
        }
      });
      console.log('------------ creating quote:, ', contact);
      insert_agreement({
        variables: {
          billing_address_id: contact.address_id,
          agreement_template_id: template.id,
          contact_id: contact.id,
          shipping_address_id: contact.address_id,
          line_items: lineItems,
          sales_tax_rate: userInfo.default_sales_tax_rate,
          number: `${userInfo.lastAgreementNumber + 1}`,
          user_id: userInfo.id,
        },
      });
    } else {
      const lineItems: AgreementLineItemType[] = [];
      cartItems.forEach((item: LineItemType, index: number) => {
        if (item.cost !== 0) {
          lineItems.push({
            name: '',
            agreement_id: -1,
            catalog_item_id: item.id,
            current_cost: item.cost,
            price: item.price,
            qty: item.qty ? item.qty : 1,
            taxable: item.taxable,
            discount: 0,
            catalog_item: {
              name: item.name,
            },
            id: index,
          });
        }
      });

      const newAgreements = agreements.agreements.slice();
      const lastAgreement = newAgreements[0] || {id: 0};
      const newMutations = offline_mutations.data;
      newMutations.push({
        type: 'CREATE_AGREEMENT',
        itemId: lastAgreement.id + 1,
      });
      setAction('offline_mutations', {data: newMutations});
      const agreement: Agreement = {
        billing_address_id: contact.address_id,
        agreement_template_id: template.id,
        agreement_template: template,
        contact_id: contact.id,
        created: new Date(),
        id: lastAgreement.id + 1,
        last_modified: new Date(),
        shipping_address_id: contact.address_id,
        line_items: lineItems,
        sales_tax_rate: userInfo.default_sales_tax_rate,
        number: `${userInfo.lastAgreementNumber + 1}`,
        address: contact.address,
        addressByShippingAddressId: contact.address,
        revision: 0,
        user_id: userInfo.id,
        user: userInfo,
        contact: contact,
      };
      newAgreements.unshift(agreement);
      setAction('agreements', {agreements: newAgreements});
      const contactsInStore = JSON.parse(JSON.stringify(contacts.contacts));
      const newContacts = contactsInStore.map((ct: Contact) => {
        if (ct.id === contact.id) {
          ct.agreements?.push(agreement);
        }
        return ct;
      });
      setAction('contacts', {contacts: newContacts});
      navigation.navigate(AppRouteEnum.ContactAgreementDetails, {
        agreement,
        contact: contact,
        parent: `${contact.name_first} ${contact.name_last}`,
      });
      setAction('user', {
        lastAgreementNumber: userInfo.lastAgreementNumber + 1,
      });
    }
  };

  // Calculate Total Price
  let totalPrice = 0;
  cartItems.map((item: LineItemType) => {
    if (item.qty !== undefined) {
      totalPrice += item.price * item.qty;
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
              <React.Fragment key={`catalog-content-${index}-${id}`}>
                {item.type === 'switch' ? (
                  <LineItemWithSwitch
                    key={`lineitem-withswitch-${index}-${id}`}
                    item={item}
                    qty={
                      cartItems[
                        cartItems.findIndex(
                          (it: LineItemType) => it.id === item.id,
                        )
                      ]?.qty || 0
                    }
                    setQty={(num) => updateQty(item, num)}
                  />
                ) : (
                  <LineItem
                    key={`lineitem-${index}-${id}`}
                    active={
                      cartItems.findIndex(
                        (it: LineItemType) => it.id === item.id,
                      ) > -1
                    }
                    item={item}
                    setActive={() => chooseItem(item)}
                  />
                )}
              </React.Fragment>
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
          rightIconContent={
            <Icon color={'#fff'} name={'ios-arrow-forward-sharp'} size={20} />
          }
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
    paddingHorizontal: themeStyle.scale(15),
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
    paddingLeft: 30,
    borderTopLeftRadius: 0,
    paddingVertical: 14,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  createBtnText: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anSemiBold',
      size: 18,
    }),
  },
});
