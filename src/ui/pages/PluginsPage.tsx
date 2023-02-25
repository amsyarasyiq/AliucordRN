import { disablePlugin, enablePlugin, isPluginEnabled, plugins, uninstallPlugin } from "../../api/PluginManager";
import { Plugin, PluginManifest } from "../../entities";
import { Constants, Dialog, Navigation, NavigationNative, React, SemanticColors, SemVer, Styles, URLOpener } from "../../metro";
import { getAssetId } from "../../utils/getAssetId";
import { Forms, General, Search, styles } from "../components";
import Card from "../components/Card";

let searchQuery: string;
let updateList: (filter?: (plugin: Plugin) => boolean) => void;

const { View, Text, FlatList, Image, ScrollView, Pressable, LayoutAnimation } = General;
const { FormSwitch } = Forms;

const changelogStyles = Styles.createThemedStyleSheet({
    description: {
        marginLeft: 25,
        marginRight: 25,
        color: SemanticColors.TEXT_NORMAL,
        fontFamily: Constants.Fonts.PRIMARY_NORMAL
    },
    title: {
        fontSize: 20,
        color: SemanticColors.TEXT_NORMAL,
        fontFamily: Constants.Fonts.PRIMARY_BOLD,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15
    },
    viewStyle: {
        marginBottom: 15
    },
    divider: {
        marginTop: 20,
        width: "50%",
        alignSelf: "center",
        height: 2,
        borderBottomWidth: 1,
        borderColor: SemanticColors.BACKGROUND_MODIFIER_ACCENT
    }
});

function getPlugins(): Plugin[] {
    return searchQuery ? Object.values(plugins).filter(({ manifest }) => {
        const { name, description, authors } = manifest;

        // If there is a search query, return plugins
        return !!(
            name.toLowerCase().includes(searchQuery.toLowerCase())
            || description.toLowerCase().includes(searchQuery.toLowerCase())
            || authors?.find?.(a => (a.name ?? a).toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }) : Object.values(plugins);
}

function PluginChangelogsPage({ plugin }: { plugin: PluginManifest; }): JSX.Element {
    if (!plugin.changelog) return (<></>);

    // sort versions and filter out invalid ones
    const sortedVersions = SemVer.rsort(Object.keys(plugin.changelog).filter(f => SemVer.valid(f)));

    return (<ScrollView key="ChangelogView" style={changelogStyles.viewStyle}>
        {sortedVersions.map(v => (
            <View key={v}>
                <Text style={changelogStyles.title}>v{v}</Text>
                <Text style={changelogStyles.description}>{plugin.changelog?.[v]}</Text>
                <View style={changelogStyles.divider}></View>
            </View>
        ))}
    </ScrollView>);
}

function PluginCard({ plugin }: { plugin: PluginManifest; }) {
    const [isEnabled, setIsEnabled] = React.useState(isPluginEnabled(plugin.name));

    const navigation = NavigationNative.useNavigation();
    const buttons = [] as any[];

    const { SettingsModal } = plugins[plugin.name];
    if (SettingsModal && isEnabled) {
        buttons.push({
            text: "Settings",
            onPress: () => Navigation.push(SettingsModal),
            size: "small",
            color: "brand",
            icon: "ic_settings_white_24px"
        });
    }

    buttons.push({
        text: "Uninstall",
        onPress: () => {
            Dialog.show({
                title: `Uninstall ${plugin.name}?`,
                body: "Are you sure? The plugin will stopped and deleted. This action cannot be undone.",
                confirmText: "Uninstall",
                cancelText: "Cancel",
                confirmColor: "red",
                isDismissable: true,
                onConfirm: () => {
                    uninstallPlugin(plugin.name).then(res => {
                        res && updateList(x => x.name !== plugin.name);
                    });
                },
            });
        },
        size: "small",
        color: "red",
        icon: "trash"
    });

    return (
        <Card
            header={{
                title: plugin.name,
                version: plugin.version,
                authors: plugin.authors
            }}
            trailing={<FormSwitch
                value={isEnabled}
                style={{ marginVertical: -15 }}
                onValueChange={(v: boolean) => {
                    v
                        ? enablePlugin(plugin.name)
                        : disablePlugin(plugin.name);
                    setIsEnabled(v);
                }} />
            }
            description={plugin.description ?? "No description provided."}
            icons={[
                ...(plugin.repo ? [
                    <Pressable
                        key="repo"
                        style={styles.icons}
                        onPress={() => URLOpener.openURL(plugin.repo)}
                    >
                        <Image source={getAssetId("img_account_sync_github_white")} />
                    </Pressable>
                ] : []),
                ...(plugin.changelog ? [
                    <Pressable
                        key="changelog"
                        style={styles.icons}
                        onPress={() => {
                            navigation.push("AliucordCustomPage", {
                                title: `${plugin.name}'s Changelogs`,
                                render: () => <PluginChangelogsPage plugin={plugin} />,
                            });
                        }}
                    >
                        <Image source={getAssetId("ic_information_filled_24px")} />
                    </Pressable>
                ] : [])
            ]}
            buttons={buttons}
        />
    );
}

export default function PluginsPage() {
    const [entities, setEntities] = React.useState(getPlugins());

    updateList = (filter = () => true) => {
        setEntities(getPlugins().filter(filter));

        LayoutAnimation.configureNext({
            duration: 300,
            update: {
                type: LayoutAnimation.Types.easeInEaseOut
            }
        });
    };

    return (<>
        <Search
            style={styles.search}
            placeholder='Search plugins...'
            onChangeText={(v: string) => {
                searchQuery = v;
                updateList();
            }}
        />
        <ScrollView style={styles.container}>
            {!entities.length ?
                <View style={styles.emptyPageImage}>
                    <Image source={getAssetId("img_connection_empty_dark")} />
                    <Text style={styles.emptyPageText}>
                        {searchQuery ? "No results were found." : "You don't have any plugins installed."}
                    </Text>
                </View>
                :
                <FlatList
                    data={entities}
                    renderItem={({ item }) => <PluginCard
                        key={item.name}
                        plugin={item.manifest}
                    />}
                    keyExtractor={plugin => plugin.name}
                    style={styles.list}
                />
            }
        </ScrollView>
    </>);
}
