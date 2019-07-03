# relation-entity

Very similar in use to the Entity adapter that comes with ngrx.

export interface State extends EntityRelationState<InvoiceItem> {
    // additional entities state properties
}

export const adapter: EntityRelationAdapter<InvoiceItem> = createEntityRelationAdapter<InvoiceItem>(
    {
        selectId: (invoiceitem: InvoiceItem) => invoiceitem.id,
        selectKey: {
            invoice: (invoiceitem: InvoiceItem) => invoiceitem.invoicetid
        },
    }
);

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

...

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
    selectKeys,
} = adapter.getSelectors();

In your selectors:

export const getInvoiceItems = createSelector(getInvoiceState, (state) => state.invoiceitems);
export const getInvoiceItemEntities = createSelector(getInvoiceItems, invoice_item_entity.selectEntities);
export const getInvoiceItemRelations = createSelector(getInvoiceItems, invoice_item_entity.selectKeys);

export const SelectedInvoiceItems = createSelector(
    getInvoiceItemRelations,
    getInvoiceItemEntities,
    getInvoicePrimary, (itemrelations, itementities, selected) => 
      itemrelations['invoice'] && itemrelations['invoice'][selected.id]?
      itemrelations['invoice'][selected.id].map(id => itementities[id]):
      []
);

Todo:

Before producing an npm package:

This is at proof of concept stage, I simply copied the ngrx/entity tree onto my machine and started editing things. 
There is lots of duplication that can be cleaned up, and make ngrx/entity a dependency.

Sorting is not implemented. I don't know what to think of this, how it would be used. I am sorting in my selectors 
since the lists of related objects is usually small. Ideas?

State initialization is not correct. As you can see in the selector example you have to check for the existence of 
selectKey properties, as they don't exist in an empty state. the selectKey property, and the properties that make the relation don't exist separate from the data. I'm not sure where to go with this. It would be nice to have a selector that would be simple;

itemrelations['invoice'][selected.id].map(id => itementities[id])

What I'm doing is this:

itemrelations['invoice'] && itemrelations['invoice'][selected.id]?
itemrelations['invoice'][selected.id].map(id => itementities[id]):
[]

Initializing the selectKey properties can be done easily, but that only gets halfway there. 

I'm finding I want some way of doing and & or on the selectKey lists. For example, if I have a contact collection, 
where contacts have characteristics; business, type of business, person, where they live, gender, etc. I can create 
a key on each of these contact properties and get a list of businesses, list of a certain type of business, contacts 
in a city, etc. To select food stores in a certain city comes back to filtering an array. I haven't thought this 
through yet. One specific issue I'm working out is my contacts have an active property. I'm using this to limit 
choices in dropdown selects for customers or vendors. an active vendor list. There are lots of ways to do this, 
and I'm wondering if this is the place.

