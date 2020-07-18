/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, Text, Switch, Image, ScrollView} from 'react-native';
import gql from 'graphql-tag';
import randomColor from 'randomcolor';

import {useQuery} from '@apollo/react-hooks';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {Agreement} from '@utils/types';
import {AppHeader, AppText, AppSearchInput, Loading} from '@root/components';
import AgreementTile from './AgreementTile';

export const FETCH_AGREEMENTS = gql`
  query AgreementsQuery($type: agreement_event!) {
    agreements(limit: 10, order_by: {created: desc}) {
      agreement_events(where: {type: {_neq: $type}}) {
        type
      }
      contact {
        name_first
        name_last
      }
      created
    }
  }
`;

export default function Dashboard() {
  const {styles} = useStyles(getStyles);
  const [BgColors, setBgColors] = useState<string[]>([]);
  const {data, error, loading} = useQuery(FETCH_AGREEMENTS, {
    variables: {type: 'accepted'},
  });
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const onFilterAgreement = (text: string) => {
    const filteredAgreements = agreements.filter(
      (agreement: Agreement) =>
        `${agreement.contact?.name_first} ${agreement.contact?.name_last}`
          .toLowerCase()
          .indexOf(text.toLowerCase()) > -1,
    );
    setVisibleAgreements(filteredAgreements);
    setSearchText(text);
  };

  if (!agreements.length) {
    if (error) {
      console.error(error);
      return <Text>Error</Text>;
    }
    if (loading) {
      return <Loading />;
    }
    setAgreements(data.agreements as Agreement[]);
    setBgColors(
      randomColor({luminosity: 'dark', count: data.agreements.length}),
    );
    setVisibleAgreements(data.agreements);
  }
  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={
          <View style={styles.flexRow}>
            <Text style={styles.switchText}>Show details</Text>
            <Switch
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShowDetails(!showDetails)}
              value={showDetails}
            />
          </View>
        }
        pageTitle={'Dashboard'}
        toolbarCenterContent={
          <AppSearchInput value={searchText} onChange={onFilterAgreement} />
        }
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <ScrollView style={styles.mainContent}>
        <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
          Recent Open Agreements
        </AppText>
        <View style={styles.rowLayout} key={visibleAgreements.length}>
          {visibleAgreements.map((agreement, index) => (
            <AgreementTile
              key={index}
              agreement={agreement}
              color={BgColors[index]}
            />
          ))}
        </View>
      </ScrollView>
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
  switchText: {
    marginRight: themeStyle.scale(10),
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
    paddingLeft: themeStyle.scale(20),
  },
});